const URL = "ws://localhost:8181/core";

export type WebMusicControlMessage = {
    type: string;
    data: {
        type: string;
        name: string | null;
    };
};

export type AudioControlMessage = {
    type: string;
};

export type GenericMessage = {
    type: string;
    data: Record<string, any>;
};

export default class MycroftClient {
    private static instance: MycroftClient;

    static getInstance() {
        this.instance = this.instance ?? new MycroftClient();
        return this.instance;
    }

    private socket: WebSocket;
    private webMusicControlEventHandlers: Map<string, Array<(message: WebMusicControlMessage) => void>> = new Map();
    private audioControlEventHandlers: Map<string, Array<(message: AudioControlMessage) => void>> = new Map();
    private genericEventHandlers: Map<string, Array<(message: GenericMessage) => void>> = new Map();

    private constructor() {
        this.socket = new WebSocket(URL);
        console.log("Created WebSocket, registering default event handler");
        this.registerDefaultHandlers();
    }

    // SOCKET HANDLERS

    private registerDefaultHandlers() {
        this.socket.addEventListener("message", event => {
            const data = JSON.parse(event.data);
            // console.log(data);
            if ("type" in data) {
                if (data.type.includes(":")) {
                    const [messageSender, messageType] = data.type.split(":");
                    if (messageSender === "web-music-control") {
                        this.handleWebMusicControlMessage(messageType, data);
                        return;
                    }
                }

                if (data.type.includes("mycroft.audio.service")) {
                    const messageType = data.type.split(".").pop();
                    this.handleAudioControlMessage(messageType, data);
                    return;
                }

                this.handleGenericMessage(data.type, data);
            }
        });
    }

    sendMessage(messageType: string, data: Record<string, any>) {
        console.log(`Sending message of type ${messageType}`);
        this.socket.send(JSON.stringify({ type: messageType, data: data }));
    }

    // EVENT HANDLERS

    private handleWebMusicControlMessage(messageType: string, message: WebMusicControlMessage) {
        const handlers = this.webMusicControlEventHandlers.get(messageType);
        if (handlers) {
            console.log(`Handling Web Music Control Message of type ${messageType}`);
            handlers.forEach(handler => handler(message));
        } else {
            console.log(`Web Music Control Event Handler not available for ${messageType}`);
        }
    }

    private handleAudioControlMessage(messageType: string, message: AudioControlMessage) {
        const handlers = this.audioControlEventHandlers.get(messageType);
        if (handlers) {
            console.log(`Handling Audio Control Message of type ${messageType}`);
            handlers.forEach(handler => handler(message));
        } else {
            console.log(`Audio Control Event Handler not available for ${messageType}`);
        }
    }

    private handleGenericMessage(messageType: string, message: GenericMessage) {
        const handlers = this.genericEventHandlers.get(messageType);
        if (handlers) {
            console.log(`Handling generic Message of type ${messageType}`);
            handlers.forEach(handler => handler(message));
        } else {
            console.log(`Generic Handler not available for ${messageType}`);
        }
    }

    // EVENT HANDLER REGISTRATION

    onWebMusicControlMessage(eventName: string, eventHandler: (message: WebMusicControlMessage) => void) {
        console.debug(`Registering music playback event handler for ${eventName}`);
        const handlers = this.webMusicControlEventHandlers.get(eventName);
        if (handlers) {
            handlers.push(eventHandler);
        } else {
            this.webMusicControlEventHandlers.set(eventName, [eventHandler]);
        }
    }

    onAudioControlMessage(eventName: string, eventHandler: (message: AudioControlMessage) => void) {
        console.debug(`Registering audio control event handler for ${eventName}`);
        const handlers = this.audioControlEventHandlers.get(eventName);
        if (handlers) {
            handlers.push(eventHandler);
        } else {
            this.audioControlEventHandlers.set(eventName, [eventHandler]);
        }
    }

    onGenericMessage(eventName: string, eventHandler: (message: GenericMessage) => void) {
        console.debug(`Registering generic event handler for ${eventName}`);
        const handlers = this.genericEventHandlers.get(eventName);
        if (handlers) {
            handlers.push(eventHandler);
        } else {
            this.genericEventHandlers.set(eventName, [eventHandler]);
        }
    }
}

const URL = "ws://localhost:8181/core";

export type WebMusicControlMessage = {
    type: string;
    data: {
        type: string;
        name: string | null;
    };
};

export default class MycroftClient {
    private static instance: MycroftClient;

    static getInstance() {
        this.instance = this.instance ?? new MycroftClient();
        return this.instance;
    }

    private socket: WebSocket;
    private webMusicControlEventHandlers: Map<string, Array<(message: WebMusicControlMessage) => void>> = new Map();

    private constructor() {
        this.socket = new WebSocket(URL);
        console.log("Created WebSocket, registering default event handler");
        this.registerDefaultHandlers();
    }

    private registerDefaultHandlers() {
        this.socket.addEventListener("message", event => {
            const data = JSON.parse(event.data);
            // console.log(data);
            if ("type" in data) {
                const [messageSender, messageType] = data.type.split(":");
                if (messageSender === "web-music-control") {
                    console.log(`Received message from ${messageSender} with type ${messageType}`);
                    this.handleWebMusicControlMessage(messageType, data);
                }
            }
        });
    }

    private handleWebMusicControlMessage(messageType: string, message: WebMusicControlMessage) {
        const handlers = this.webMusicControlEventHandlers.get(messageType);
        if (handlers) {
            handlers.forEach(handler => handler(message));
        }
    }

    on(eventName: string, eventHandler: (message: WebMusicControlMessage) => void) {
        console.debug(`Registering event handler for ${eventName}`);
        const handlers = this.webMusicControlEventHandlers.get(eventName);
        if (handlers) {
            handlers.push(eventHandler);
        } else {
            this.webMusicControlEventHandlers.set(eventName, [eventHandler]);
        }
    }
}

import io from "socket.io-client";
import Server from "socket.io-client";

export default class LeonClient {
    private readonly clientConfig = {
        appName: "smart-mirror",
        // TODO: Get this from env
        serverHost: "localhost",
        serverPort: "1337",
        minDecibels: -40, // Noise detection sensitivity
        maxBlankTime: 1000 // Maximum time to consider a blank (ms)
    };
    private readonly capabilities = ["apple-music"];
    private socket: SocketIOClient.Socket;
    private eventHandlers: { [key: string]: Function } = {};

    constructor() {
        console.log("Attempting to connect to Leon");
        this.socket = io(`${this.clientConfig.serverHost}:${this.clientConfig.serverPort}`);
        this.init();
    }

    /**
     * Connect to the Leon Server
     */
    init() {
        this.socket.on("connect", () => {
            console.log("connected");
            this.socket.emit("init", this.clientConfig.appName, this.capabilities);
        });

        this.socket.on("recognized", (speechString: string, confirmReceived: Function) => {
            console.log("Received Leon Input Speech");
            if (Object.prototype.hasOwnProperty.call(this.eventHandlers, "recognized")) {
                this.eventHandlers["recognized"](speechString);
            }
            confirmReceived("string-received");
        });
    }

    public registerEventHandler(eventName: string, eventHandler: Function) {
        this.eventHandlers[eventName] = eventHandler;
    }
}

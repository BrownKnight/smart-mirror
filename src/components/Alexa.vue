<template>
    <div class="alexa"></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import { APLClient } from "apl-client";
import { NavigationEvent } from "./lib/messages/NavigationEvent";
import { IClientConfig, Client, IClient } from "./lib/messages/client";
import {
    AlexaState,
    IAPLCoreMessage,
    IRenderStaticDocumentMessage,
    IRenderPlayerInfoMessage,
    IBaseOutboundMessage,
    IRenderTemplateMessage,
    IAlexaStateChangedMessage,
    IInitRequest,
    IInitResponse,
    IFocusAcquireRequestMessage,
    IFocusReleaseRequestMessage,
    IFocusResponseMessage,
    IOnFocusChangedMessage,
    IOnFocusChangedReceivedConfirmationMessage,
    IActivityReportMessage,
    INavigationReportMessage,
    OutboundMessageType,
    IRequestAuthorizationMessage,
    IAuthorizationChangeMessage,
    IAPLRenderMessage,
    IGuiConfigurationMessage,
    IDeviceWindowStateMessage,
    IBaseInboundMessage
} from "./lib/messages/messages";
import { resolveRenderTemplate } from "./lib/displayCards/AVSDisplayCardHelpers";
import { SDKLogTransport } from "./lib/messages/sdkLogTransport";
import { Logger as ILogger, LoggerFactory } from "./lib/utils/logger";
import { FocusManager } from "./lib/focus/FocusManager";
import { ActivityTracker } from "./lib/activity/ActivityTracker";
import { ActivityEvent } from "./lib/activity/ActivityEvent";
import { IDeviceAppConfig, AudioInputInitiator } from "./lib/config/IDeviceAppConfig";
import { IDisplayPixelDimensions } from "./lib/config/visualCharacteristics/IDeviceDisplay";
import { resolveDeviceAppConfig, resolveDeviceWindowState } from "./lib/config/GuiConfigHelpers";
import { IWindowState } from "./lib/config/visualCharacteristics/IWindowState";

const HOST = "localhost";
const PORT = 8933;

/// Maximum APL version supported by the runtime.
const APL_MAX_VERSION = "1.2";

/// The minimum SmartScreenSDK version required for this runtime.
const SMART_SCREEN_SDK_MIN_VERSION = "0.10";

/// Indicates whether the SDK has built with WebSocket SSL Disabled.
const DISABLE_WEBSOCKET_SSL = true;

export interface AppState {
    alexaState: AlexaState;
    targetWindowId: string | any;
    playerInfoMessage: IRenderPlayerInfoMessage | any;
    updateActiveAPLRendererWindow: boolean | any;
}


export class WebsocketConnectionWrapper extends APLClient {
    protected client: IClient;

    constructor(client: IClient) {
        super();
        this.client = client;
        client.connect();
    }

    public sendMessage(message: object) {
        switch (Object(message).type) {
            case "executeCommands":
            case "renderStaticDocument": {
                this.client.sendMessage(Object(message));
                break;
            }
            default: {
                const wrapped: any = {
                    type: "aplEvent",
                    payload: message
                };
                this.client.sendMessage(wrapped);
            }
        }
    }

    public handleMessage(message: IAPLCoreMessage) {
        const unwrapped = message.payload;
        this.onMessage(unwrapped);
    }
}

class AlexaClient {
    protected deviceAppConfig: IDeviceAppConfig | any;
    protected windowState: IWindowState | any;
    protected client: IClient | any;
    protected aplConnection: WebsocketConnectionWrapper | any;
    protected logger: ILogger | any;
    protected focusManager: FocusManager | any;
    protected activityTracker: ActivityTracker | any;
    protected talkButtonDownMessage: OutboundMessageType | any;
    protected talkButtonUpMessage: OutboundMessageType | any;
    protected eventListenersAdded: boolean | any;
    protected state: AppState | any;

    constructor() {
        // NOTE: No logging should happen before here!
        this.logger = LoggerFactory.getLogger("App");
        // this.focusManager = new FocusManager({
        //     acquireFocus: this.sendFocusAcquireRequest.bind(this),
        //     releaseFocus: this.sendFocusReleaseRequest.bind(this)
        // });
        // this.activityTracker = new ActivityTracker(this.sendActivityEvent.bind(this));

        const clientConfig: IClientConfig = {
            host: HOST,
            port: PORT,
            onMessage: this.onClientMessage.bind(this),
            insecure: DISABLE_WEBSOCKET_SSL
        };

        this.client = new Client(clientConfig);
        this.aplConnection = new WebsocketConnectionWrapper(this.client);
        SDKLogTransport.initialize(this.client);

        this.state = {
            alexaState: AlexaState.IDLE,
            playerInfoMessage: undefined,
            updateActiveAPLRendererWindow: false,
            targetWindowId: undefined
        };

        this.eventListenersAdded = false;
    }

    protected onClientMessage(message: IBaseInboundMessage) {
        switch (message.type) {
            case "initRequest": {
                this.handleInitRequest(message);
                console.log("Handle initRequest");
                break;
            }
            case "guiConfiguration": {
                this.handleGuiConfigurationMessage(message);
                console.log("Handle guiConfiguration");
                break;
            }
            case "requestAuthorization": {
                // this.handleRequestAuthorization(message as IRequestAuthorizationMessage);
                console.log("Handle requestAuthorization");
                break;
            }
            case "authorizationChange": {
                // this.handleAuthorizationStateChanged(message as IAuthorizationChangeMessage);
                console.log("Handle authorizationChange");
                break;
            }
            case "alexaStateChanged": {
                // this.handleAlexaStateChangedMessage(message);
                console.log("Handle alexaStateChanged");
                break;
            }
            case "focusResponse": {
                // this.handleFocusResponse(message);
                console.log("Handle focusResponse");
                break;
            }
            case "onFocusChanged": {
                // this.handleOnFocusChanged(message);
                console.log("Handle onFocusChanged");
                break;
            }
            case "renderTemplate": {
                // this.handleRenderTemplateMessage(message);
                console.log("Handle renderTemplate");
                break;
            }
            case "renderPlayerInfo": {
                // this.handleRenderPlayerInfoMessage(message);
                console.log("Handle renderPlayerInfo");
                break;
            }
            case "clearPlayerInfoCard": {
                // this.handleClearPlayerInfoWindow();
                console.log("Handle clearPlayerInfoCard");
                break;
            }
            case "clearDocument":
            case "clearTemplateCard": {
                // this.handleClearNonPlayerInfoWindow();
                console.log("Handle clearTemplateCard");
                break;
            }
            case "aplRender": {
                // this.handleAPLRender(message as IAPLRenderMessage);
                console.log("Handle aplRender");
                break;
            }
            case "aplCore": {
                // this.aplConnection.handleMessage(message as IAPLCoreMessage);
                console.log("Handle aplCore");
                break;
            }
            default: {
                this.logger.warn("received message with unsupported type. Type: ", message.type);
                break;
            }
        }
    }

    protected handleInitRequest(message : IBaseInboundMessage) {
        const initRequestMessage : IInitRequest = message as IInitRequest;
        this.logger.debug(`message: ${JSON.stringify(initRequestMessage)}`);
        const smartScreenSDKVer = initRequestMessage.smartScreenSDKVersion;
        this.logger.debug(`APL version: ${APL_MAX_VERSION} SDKVer: ${smartScreenSDKVer}`);

        const isSupported = true;
        this.sendInitResponse(isSupported, APL_MAX_VERSION);
    }


    protected handleGuiConfigurationMessage(message : IBaseInboundMessage) {
        const guiConfigurationMessage : IGuiConfigurationMessage
            = message as IGuiConfigurationMessage;

        this.deviceAppConfig = resolveDeviceAppConfig(
            window.innerWidth, window.innerHeight, guiConfigurationMessage.payload);

        this.windowState = resolveDeviceWindowState(this.deviceAppConfig);

        switch (this.deviceAppConfig.audioInputInitiator) {
            case AudioInputInitiator.PRESS_AND_HOLD : {
                this.talkButtonDownMessage = 'holdToTalk';
                this.talkButtonUpMessage = 'holdToTalk';
                break;
            }
            case AudioInputInitiator.TAP : {
                this.talkButtonDownMessage = 'tapToTalk';
                this.talkButtonUpMessage = undefined;
                break;
            }
            default : {
                break;
            }
        }
        if (!this.eventListenersAdded) {
            this.eventListenersAdded = true;
            document.addEventListener('keydown', this.handleKeyDown.bind(this));
            document.addEventListener('keyup', this.handleKeyUp.bind(this));
        }

        this.sendDeviceWindowState();
    }


    protected sendInitResponse(isSupported : boolean, APLMaxVersion : string) {
        const message : IInitResponse = {
            type : 'initResponse',
            isSupported,
            APLMaxVersion
        };

        this.client.sendMessage(message);
    }

    protected sendFocusAcquireRequest(channelName : string, token : number) {
        const message : IFocusAcquireRequestMessage = {
            type : 'focusAcquireRequest',
            token,
            channelName
        };
        this.client.sendMessage(message);
    }

    protected sendFocusReleaseRequest(channelName : string, token : number) {
        const message : IFocusReleaseRequestMessage = {
            type : 'focusReleaseRequest',
            token,
            channelName
        };
        this.client.sendMessage(message);
    }

    protected sendOnFocusChangedReceivedConfirmation(token : number) {
        const message : IOnFocusChangedReceivedConfirmationMessage = {
            type : 'onFocusChangedReceivedConfirmation',
            token
        };
        this.client.sendMessage(message);
    }

    protected sendTalkButtonEvent(type : OutboundMessageType) {
        if (type === undefined) {
            return;
        }
        const message : IBaseOutboundMessage = {
            type
        };
        this.client.sendMessage(message);
    }

    protected sendActivityEvent(event : ActivityEvent) {
        if (this.state.targetWindowId === undefined) {
            return;
        }
        const message : IActivityReportMessage = {
            type : 'activityEvent',
            event
        };
        this.client.sendMessage(message);
    }

    protected sendNavigationEvent(event : NavigationEvent) {
        const message : INavigationReportMessage = {
            type : 'navigationEvent',
            event
        };
        this.client.sendMessage(message);
    }

    protected sendDeviceWindowState() {
        const deviceWindowStateMessage : IDeviceWindowStateMessage = {
            type : 'deviceWindowState',
            payload : this.windowState
        };
        this.client.sendMessage(deviceWindowStateMessage);
    }

    protected lastKeyDownCode : string | any;

    private handleKeyDown(event : any) {
        // Only handle key down events once
        if (event.code === this.lastKeyDownCode) {
            return;
        }
        // this.handleUserInteraction();
        switch (event.code) {
            // Press talk key to start audio recognition
            case this.deviceAppConfig.deviceKeys.talkKey.code : {
                this.sendTalkButtonEvent(this.talkButtonDownMessage);
                break;
            }
            // Similar to EXIT button pressed on remote
            case this.deviceAppConfig.deviceKeys.exitKey.code:
                this.sendNavigationEvent(NavigationEvent.EXIT);
                break;
            // Similar to BACK button pressed on remote
            case this.deviceAppConfig.deviceKeys.backKey.code:
                this.sendNavigationEvent(NavigationEvent.BACK);
                break;
            default : {
                break;
            }
        }

        this.lastKeyDownCode = event.code;
    }

    private handleKeyUp(event : any) {
        this.lastKeyDownCode = undefined;

        switch (event.code) {
            // Release talk key to stop audio recognition on PRESS_AND_HOLD integrations
            case this.deviceAppConfig.deviceKeys.talkKey.code: {
                this.sendTalkButtonEvent(this.talkButtonUpMessage);
                break;
            }
            default : {
                break;
            }
        }
    }

    private setTokenForWindowId(token : string, windowId : string) {
        for (const window of this.windowState.instances) {
            if (window.id === windowId) {
                window.token = token;
                break;
            }
        }

        this.sendDeviceWindowState();
    }

    public componentDidMount() {
        this.client.connect();
    }
}

@Component
export default class Alexa extends Vue {
    private client: AlexaClient | any;

    created() {
        console.log("Constructing Alexa")
        this.client = new AlexaClient();
        console.log("Alexa Constructed")
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>

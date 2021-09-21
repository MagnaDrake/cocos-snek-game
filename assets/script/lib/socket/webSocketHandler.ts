import { _decorator, Component } from 'cc';
import { SOCKET, SOCKET_EVENT } from '../enum/socket';
import { JoinRoomData, PingData, StateData, GameOverData } from '../interface/socket';
const { ccclass } = _decorator;

@ccclass('WebSocketHandler')
export class WebSocketHandler extends Component {
    private ws: WebSocket | null = null;

    connect(username: string, url: string, room_id: string = "", player_id: string = "") {
        if (this.ws) {
            this.close();
        }
        this.setCookie({ username, room_id, player_id });

        this.ws = new WebSocket(url);
        this.ws.onopen = this.onOpen.bind(this);
        this.ws.onmessage = this.onMessage.bind(this);
        this.ws.onerror = this.onError.bind(this);
        this.ws.onclose = this.onClose.bind(this);
    }

    onOpen() {
        console.log("WebSocket connection established.");
        this.node.emit(SOCKET.OPENED);
    }

    onDestroy() {
        this.close();
    }

    onMessage(event: MessageEvent) {
        // handle join room message
        const data = JSON.parse(event.data);

        switch(data.event as SOCKET_EVENT) {
            case SOCKET_EVENT.JOIN_ROOM: {
                this.node.emit(SOCKET.MESSAGE_JOIN, data as JoinRoomData);
                break;
            }

            case SOCKET_EVENT.WORLD_STATE: {
                this.node.emit(SOCKET.MESSAGE_STATE, data as StateData);
                break;
            }

            case SOCKET_EVENT.PONG: {
                this.node.emit(SOCKET.MESSAGE_PONG, data as PingData);
                break;
            }

            case SOCKET_EVENT.GAME_OVER: {
                this.node.emit(SOCKET.MESSAGE_GAME_OVER, data as GameOverData);
                break;
            }

        }
    }

    onError(event: Event) {
        this.node?.emit(SOCKET.ERROR, `WebSocket error observed: ${event}`)
    }

    onClose() {
        this.ws = null;
        this.node?.emit(SOCKET.CLOSED, "WebSocket instance closed");
    }

    send(message: any) {
        try {
            this.ws?.send(message);
        } catch (error) {
            console.log("Error sending message: " + error);
        }
    }

    close() {
        try {
            this.ws?.close();
        } catch (error) {
            console.log("Error closing connection: " + error);
        }
    }

    setCookie(objects: Record<string, string>) {
        for (let key of Object.keys(objects)) {
            document.cookie = `${key}=${objects[key]}; SameSite=None; Secure; Path=/`;
        }
    }
}

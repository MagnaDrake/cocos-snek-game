import { _decorator, Component, Node, EventTouch, Vec2 } from 'cc';
import { GAME_CONTROL_EVENT } from '../enum/gameControl';
import { JOYSTICK_EVENT } from '../enum/joystick';
import { ROOM_MANAGER_EVENT } from '../enum/roomManager';
import { PlayerInstance } from '../interface/player';
import { getWorldPosFromUIPos } from '../lib/util/position';
import { Joystick } from '../object/joystick';
import { RoomManager } from '../object/roomManager';
const { ccclass, property } = _decorator;

@ccclass('GameControl')
export class GameControl extends Component {
    @property(Joystick)
    public readonly joystick?: Joystick;

    @property(RoomManager)
    public readonly roomManager?: RoomManager;

    onLoad() {
        this.setupListeners();
    }

    private setupListeners() {
        this.setupTouchListeners();
        this.setupJoystickListeners();
        this.setupRoomManagerListeners();
    }

    private setupTouchListeners() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    private setupJoystickListeners() {
        this.joystick?.node.on(JOYSTICK_EVENT.MOVE, this.onJoystickMove, this);
    }

    private setupRoomManagerListeners() {
        this.roomManager?.node.on(ROOM_MANAGER_EVENT.JOIN, this.onRoomJoin, this);
    }

    private onTouchStart(event: EventTouch) {
        const { x, y } = getWorldPosFromUIPos(
            event.touch?.getUILocationX() ?? 0, 
            event.touch?.getUILocationY() ?? 0
        );
        this.joystick?.spawnAt(x, y);
    }

    private onTouchMove(event: EventTouch) {
        const { x, y } = getWorldPosFromUIPos(
            event.touch?.getUILocationX() ?? 0, 
            event.touch?.getUILocationY() ?? 0
        );
        this.joystick?.moveButtonTo(x, y);
    }

    private onTouchEnd() {
        this.joystick?.despawn();
    }

    private onJoystickMove(direction: Vec2, magnitude: number) {
        this.node.emit(GAME_CONTROL_EVENT.JOYSTICK_MOVE, direction, magnitude);
    }

    private onRoomJoin() {
        this.roomManager?.node.on(ROOM_MANAGER_EVENT.PLAYER_INSTANCE_UPDATE, this.onPlayerInstanceUpdate, this);
    }

    private onPlayerInstanceUpdate(playerInstance: PlayerInstance, isMainPlayer: boolean) {
        if (isMainPlayer) {
            const { x, y } = playerInstance.state.velocity;
            this.joystick?.setCurrentDirection(x, y);
            this.roomManager?.node.off(ROOM_MANAGER_EVENT.PLAYER_INSTANCE_UPDATE, this.onPlayerInstanceUpdate, this);
        }
    }
}
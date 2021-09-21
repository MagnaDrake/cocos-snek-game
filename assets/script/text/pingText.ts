import { _decorator } from 'cc';
import { ASSET_KEY } from '../enum/asset';
import { ROOM_MANAGER_EVENT } from '../enum/roomManager';
import { PingData } from '../lib/interface/socket';
import { BaseText } from '../lib/text/baseText';
import { RoomManager } from '../object/roomManager';
const { ccclass, property } = _decorator;

@ccclass('PingText')
export class PingText extends BaseText {
    @property(RoomManager)
    public readonly roomManager?: RoomManager;

    constructor() {
        super('PingText', ASSET_KEY.SHOPEE_2021_BOLD);
    }

    start() {
        this.roomManager?.node.on(ROOM_MANAGER_EVENT.PONG, this.onPong, this);
    }

    private onPong(pingData: PingData) {
        const { timestamp } = pingData;
        this.setText(`PING: ${Date.now() - timestamp}ms`);
    }
}
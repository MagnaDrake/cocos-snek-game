import { _decorator, Component, Node } from 'cc';
import { ASSET_KEY } from '../enum/asset';
import { ROOM_MANAGER_EVENT } from '../enum/roomManager';
import { StateData } from '../lib/interface/socket';
import { BaseText } from '../lib/text/baseText';
import { RoomManager } from '../object/roomManager';
const { ccclass, property } = _decorator;

@ccclass('ServerPingText')
export class ServerPingText extends BaseText {
    @property(RoomManager)
    public readonly roomManager?: RoomManager;

    private previousTimestamp?: number;

    private totalDeltaTimestamp = 0;

    private totalTick = 0;

    constructor() {
        super('ServerPingText', ASSET_KEY.SHOPEE_2021_BOLD);
    }

    start() {
        this.roomManager?.node.on(ROOM_MANAGER_EVENT.STATE_UPDATE, this.onStateUpdate, this);
    }

    private onStateUpdate(state: StateData) {
        const { timestamp } = state;
        if (this.previousTimestamp) {
            const deltaTimestamp = timestamp - this.previousTimestamp;
            this.totalDeltaTimestamp += deltaTimestamp;
            this.totalTick += 1;

            this.updateServerPingText();
        }
        this.previousTimestamp = timestamp;
    }

    private updateServerPingText() {
        const { totalDeltaTimestamp, totalTick } = this;
        const averageDeltaTimestamp = totalDeltaTimestamp / totalTick;
        this.setText(`DT: ${averageDeltaTimestamp.toFixed(1)}ms`);
    }
}
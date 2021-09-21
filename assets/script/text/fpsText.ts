import { _decorator, profiler, game, director } from 'cc';
import { ASSET_KEY } from '../enum/asset';
import { BaseText } from '../lib/text/baseText';
const { ccclass, property } = _decorator;

@ccclass('FpsText')
export class FpsText extends BaseText {
    constructor() {
        super('FpsText', ASSET_KEY.SHOPEE_2021_BOLD);
    }

    start() {
        this.schedule(this.syncFPS, 0.5);
    }

    private syncFPS() {
        const fps = 1 / director.getDeltaTime();
        this.setText(`FPS: ${fps.toPrecision(3)}`);
    }
}
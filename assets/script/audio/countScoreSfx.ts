
import { _decorator, Component, Node, game } from 'cc';
import { ASSET_KEY } from '../enum/asset';
import { BaseAudio } from '../lib/audio/baseAudio';
const { ccclass, property } = _decorator;

@ccclass('CountScoreSfx')
export class CountScoreSfx extends BaseAudio {
    constructor() {
        super('CountScoreSfx', ASSET_KEY.COUNT_SCORE_SFX, false, 1);
    }
}

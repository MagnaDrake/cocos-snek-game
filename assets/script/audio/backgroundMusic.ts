
import { _decorator, Component, Node, game } from 'cc';
import { ASSET_KEY } from '../enum/asset';
import { BaseAudio } from '../lib/audio/baseAudio';
const { ccclass, property } = _decorator;

@ccclass('BackgroundMusic')
export class BackgroundMusic extends BaseAudio {
    constructor() {
        super('BackgroundMusic', ASSET_KEY.BG_MUSIC, true, 1);
    }
}

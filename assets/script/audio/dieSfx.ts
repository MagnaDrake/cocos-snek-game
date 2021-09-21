
import { _decorator, Component, Node, game } from 'cc';
import { ASSET_KEY } from '../enum/asset';
import { BaseAudio } from '../lib/audio/baseAudio';
const { ccclass, property } = _decorator;

@ccclass('DieSfx')
export class DieSfx extends BaseAudio {
    constructor() {
        super('DieSfx', ASSET_KEY.DIE_SFX, false, 1);
    }
}

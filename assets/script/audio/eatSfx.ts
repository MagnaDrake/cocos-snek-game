
import { _decorator, Component, Node, game } from 'cc';
import { ASSET_KEY } from '../enum/asset';
import { BaseAudio } from '../lib/audio/baseAudio';
const { ccclass, property } = _decorator;

@ccclass('EatSfx')
export class EatSfx extends BaseAudio {
    constructor() {
        super('EatSfx', ASSET_KEY.EAT_SFX);
    }
}

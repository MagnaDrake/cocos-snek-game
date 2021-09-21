
import { _decorator, Component, Node, game } from 'cc';
import { ASSET_KEY } from '../enum/asset';
import { BaseAudio } from '../lib/audio/baseAudio';
const { ccclass, property } = _decorator;

@ccclass('ButtonClickSfx')
export class ButtonClickSfx extends BaseAudio {
    constructor() {
        super('ButtonClickSfx', ASSET_KEY.BUTTON_CLICK_SFX);
    }
}

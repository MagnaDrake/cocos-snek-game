
import { _decorator, Component, Node, game } from 'cc';
import { ASSET_KEY } from '../enum/asset';
import { BaseAudio } from '../lib/audio/baseAudio';
const { ccclass, property } = _decorator;

@ccclass('EatVoucherSfx')
export class EatVoucherSfx extends BaseAudio {
    constructor() {
        super('EatVoucherSfx', ASSET_KEY.EAT_VOUCHER_SFX, false, 0.5);
    }
}

import { _decorator } from 'cc';
import { BaseSprite } from '../../lib/sprite/baseSprite';
import { ASSET_KEY } from '../enum/asset';
const { ccclass, property } = _decorator;

@ccclass('BlackMageSprite')
export class BlackMageSprite extends BaseSprite {
    constructor() {
        super('BlackMageSprite', ASSET_KEY.BLACK_MAGE_SPRITE, 0);
    }
}
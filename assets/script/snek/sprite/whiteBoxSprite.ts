import { _decorator } from 'cc';
import { BaseSprite } from '../../lib/sprite/baseSprite';
import { ASSET_KEY } from '../enum/asset';
const { ccclass, property } = _decorator;

@ccclass('WhiteBoxSprite')
export class WhiteBoxSprite extends BaseSprite {
    constructor() {
        super('WhiteBoxSprite', ASSET_KEY.WHITE_BOX_SPRITE);
    }
}
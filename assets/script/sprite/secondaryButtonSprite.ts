import { _decorator, Component, Node } from 'cc';
import { ASSET_KEY } from '../enum/asset';
import { BaseSprite } from '../lib/sprite/baseSprite';
const { ccclass, property } = _decorator;

@ccclass('SecondaryButtonSprite')
export class SecondaryButtonSprite extends BaseSprite {
    constructor () {
        super('SecondaryButtonSprite', ASSET_KEY.SECONDARY_BUTTON_SPRITE);
    }
}

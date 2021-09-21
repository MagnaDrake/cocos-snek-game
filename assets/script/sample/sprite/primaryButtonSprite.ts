import { _decorator, Component, Node } from 'cc';
import { ASSET_KEY } from '../enum/asset';
import { BaseSprite } from '../lib/sprite/baseSprite';
const { ccclass, property } = _decorator;

@ccclass('PrimaryButtonSprite')
export class PrimaryButtonSprite extends BaseSprite {
    constructor () {
        super('PrimaryButtonSprite', ASSET_KEY.PRIMARY_BUTTON_SPRITE);
    }
}

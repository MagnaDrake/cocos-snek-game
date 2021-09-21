import { _decorator, Component, Node } from 'cc';
import { ASSET_KEY } from '../enum/asset';
import { BaseSprite } from '../lib/sprite/baseSprite';
const { ccclass, property } = _decorator;

@ccclass('BackButtonSprite')
export class BackButtonSprite extends BaseSprite {
    constructor() {
        super('BackButtonSprite', ASSET_KEY.BACK_BUTTON_SPRITE);
    }
}
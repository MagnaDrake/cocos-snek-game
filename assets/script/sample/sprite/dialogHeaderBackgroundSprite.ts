import { _decorator, Component, Node } from 'cc';
import { ASSET_KEY } from '../enum/asset';
import { BaseSprite } from '../lib/sprite/baseSprite';
const { ccclass, property } = _decorator;

@ccclass('DialogHeaderBackgroundSprite')
export class DialogHeaderBackgroundSprite extends BaseSprite {
    constructor() {
        super('DialogHeaderBackgroundSprite', ASSET_KEY.DIALOG_HEADER_BACKGROUND_SPRITE);
    }
}
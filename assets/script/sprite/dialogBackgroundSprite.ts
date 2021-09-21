import { _decorator, Component, Node, Sprite } from 'cc';
import { ASSET_KEY } from '../enum/asset';
import { BaseSprite } from '../lib/sprite/baseSprite';
const { ccclass, property } = _decorator;

@ccclass('DialogBackgroundSprite')
export class DialogBackgroundSprite extends BaseSprite {
    constructor() {
        super('DialogBackgroundSprite', ASSET_KEY.DIALOG_BACKGROUND_SPRITE);
    }

    onLoad () {
        super.onLoad();

        if (this.sprite) {
            this.sprite.type = Sprite.Type.SLICED
        }
    }
}
import { _decorator, Component, Node, v3 } from 'cc';
import { ASSET_KEY } from '../enum/asset';
import { BaseSprite } from '../lib/sprite/baseSprite';
const { ccclass, property } = _decorator;

@ccclass('FenceExtraSprite')
export class FenceExtraSprite extends BaseSprite {
    constructor() {
        super('FenceExtraSprite', ASSET_KEY.FENCE_EXTRA_SPRITE);
    }

    onLoad () {
        super.onLoad();
        this.setRotation(v3(0, 180, 0));
    }
}
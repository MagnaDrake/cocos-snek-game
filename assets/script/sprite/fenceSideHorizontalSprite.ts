import { _decorator, Component, Node } from 'cc';
import { ASSET_KEY } from '../enum/asset';
import { BaseSprite } from '../lib/sprite/baseSprite';
const { ccclass, property } = _decorator;

@ccclass('FenceSideHorizontalSprite')
export class FenceSideHorizontalSprite extends BaseSprite {
    constructor() {
        super('FenceSideHorizontalSprite', ASSET_KEY.FENCE_SIDE_HORIZONTAL_SPRITE);
    }
}
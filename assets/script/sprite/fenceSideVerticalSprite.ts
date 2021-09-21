import { _decorator, Component, Node } from 'cc';
import { ASSET_KEY } from '../enum/asset';
import { BaseSprite } from '../lib/sprite/baseSprite';
const { ccclass, property } = _decorator;

@ccclass('FenceSideVerticalSprite')
export class FenceSideVerticalSprite extends BaseSprite {
    constructor() {
        super('FenceSideVerticalSprite', ASSET_KEY.FENCE_SIDE_VERTICAL_SPRITE);
    }
}
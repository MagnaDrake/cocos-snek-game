import { _decorator, Component, Node } from 'cc';
import { ASSET_KEY } from '../enum/asset';
import { BaseSprite } from '../lib/sprite/baseSprite';
const { ccclass, property } = _decorator;

@ccclass('FenceCornerSprite')
export class FenceCornerSprite extends BaseSprite {
    constructor() {
        super('FenceCornerSprite', ASSET_KEY.FENCE_CORNER_SPRITE);
    }
}
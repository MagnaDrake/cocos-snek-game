import { _decorator, Component, Node } from 'cc';
import { ASSET_KEY } from '../enum/asset';
import { BaseSprite } from '../lib/sprite/baseSprite';
const { ccclass, property } = _decorator;

@ccclass('PreloadBackgroundSprite')
export class PreloadBackgroundSprite extends BaseSprite {
    constructor() {
        super('PreloadBackgroundSprite', ASSET_KEY.PRELOAD_BACKGROUND_SPRITE);
    }
}

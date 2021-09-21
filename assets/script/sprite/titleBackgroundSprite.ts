import { _decorator, Component, Node, Color } from 'cc';
import { ASSET_KEY } from '../enum/asset';
import { BaseSprite } from '../lib/sprite/baseSprite';
const { ccclass, property } = _decorator;

@ccclass('TitleBackgroundSprite')
export class TitleBackgroundSprite extends BaseSprite {
    constructor() {
        super('TitleBackgroundSprite', ASSET_KEY.TITLE_BACKGROUND_SPRITE);
    }
}
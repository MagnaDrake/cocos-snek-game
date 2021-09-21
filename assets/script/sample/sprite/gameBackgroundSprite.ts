import { _decorator, Component, Node } from 'cc';
import { ASSET_KEY } from '../enum/asset';
import { BaseSprite } from '../lib/sprite/baseSprite';
const { ccclass, property } = _decorator;

@ccclass('GameBackgroundSprite')
export class GameBackgroundSprite extends BaseSprite {
    constructor() {
        super('GameBackgroundSprite', ASSET_KEY.GAME_BACKGROUND_SPRITE);
    }
}
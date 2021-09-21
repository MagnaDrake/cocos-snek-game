import { _decorator, Component, Node } from 'cc';
import { ASSET_KEY } from '../enum/asset';
import { BaseSprite } from '../lib/sprite/baseSprite';
const { ccclass, property } = _decorator;

@ccclass('FoodTurnipSprite')
export class FoodTurnipSprite extends BaseSprite {
    constructor() {
        super('FoodTurnipSprite', ASSET_KEY.FOOD_TURNIP_SPRITE);
    }
}
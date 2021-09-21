import { _decorator, Component, Node } from 'cc';
import { ASSET_KEY } from '../enum/asset';
import { BaseSprite } from '../lib/sprite/baseSprite';
const { ccclass, property } = _decorator;

@ccclass('FoodCarrotSprite')
export class FoodCarrotSprite extends BaseSprite {
    constructor() {
        super('FoodCarrotSprite', ASSET_KEY.FOOD_CARROT_SPRITE);
    }
}
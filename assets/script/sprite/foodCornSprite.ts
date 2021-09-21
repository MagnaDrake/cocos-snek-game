import { _decorator, Component, Node } from 'cc';
import { ASSET_KEY } from '../enum/asset';
import { BaseSprite } from '../lib/sprite/baseSprite';
const { ccclass, property } = _decorator;

@ccclass('FoodCornSprite')
export class FoodCornSprite extends BaseSprite {
    constructor() {
        super('FoodCornSprite', ASSET_KEY.FOOD_CORN_SPRITE);
    }
}
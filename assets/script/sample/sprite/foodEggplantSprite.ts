import { _decorator, Component, Node } from 'cc';
import { ASSET_KEY } from '../enum/asset';
import { BaseSprite } from '../lib/sprite/baseSprite';
const { ccclass, property } = _decorator;

@ccclass('FoodEggplantSprite')
export class FoodEggplantSprite extends BaseSprite {
    constructor() {
        super('FoodEggplantSprite', ASSET_KEY.FOOD_EGGPLANT_SPRITE);
    }
}
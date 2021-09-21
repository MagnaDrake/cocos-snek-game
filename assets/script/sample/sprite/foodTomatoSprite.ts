import { _decorator, Component, Node } from 'cc';
import { ASSET_KEY } from '../enum/asset';
import { BaseSprite } from '../lib/sprite/baseSprite';
const { ccclass, property } = _decorator;

@ccclass('FoodTomatoSprite')
export class FoodTomatoSprite extends BaseSprite {
    constructor() {
        super('FoodTomatoSprite', ASSET_KEY.FOOD_TOMATO_SPRITE);
    }
}
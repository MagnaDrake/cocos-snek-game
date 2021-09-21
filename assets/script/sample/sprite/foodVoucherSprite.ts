import { _decorator, Component, Node } from 'cc';
import { ASSET_KEY } from '../enum/asset';
import { BaseSprite } from '../lib/sprite/baseSprite';
const { ccclass, property } = _decorator;

@ccclass('FoodVoucherSprite')
export class FoodVoucherSprite extends BaseSprite {
    constructor() {
        super('FoodVoucherSprite', ASSET_KEY.FOOD_VOUCHER_SPRITE);
    }
}
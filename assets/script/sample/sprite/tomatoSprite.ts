import { _decorator } from 'cc';
import { ASSET_KEY } from '../enum/asset';
import { BaseSprite } from '../../lib/sprite/baseSprite';
const { ccclass, property } = _decorator;

@ccclass('TomatoSprite')
export class TomatoSprite extends BaseSprite {
    constructor() {
        super('TomatoSprite', ASSET_KEY.TOMATO_SPRITE);
    }
}
import { _decorator, Component, Node } from 'cc';
import { ASSET_KEY } from '../enum/asset';
import { BaseSprite } from '../lib/sprite/baseSprite';
const { ccclass, property } = _decorator;

@ccclass('TimerSprite')
export class TimerSprite extends BaseSprite {
    constructor() {
        super('TimerSprite', ASSET_KEY.TIMER_SPRITE);
    }
}
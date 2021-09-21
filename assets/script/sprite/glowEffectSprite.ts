import { _decorator, Component, Node } from 'cc';
import { ASSET_KEY } from '../enum/asset';
import { BaseSprite } from '../lib/sprite/baseSprite';
const { ccclass, property } = _decorator;

@ccclass('GlowEffectSprite')
export class GlowEffectSprite extends BaseSprite {
    constructor() {
        super('GlowEffectSprite', ASSET_KEY.GLOW_EFFECT_SPRITE);
    }
}
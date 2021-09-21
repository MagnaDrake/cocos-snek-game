import { _decorator, Component, Node } from 'cc';
import { ASSET_KEY } from '../enum/asset';
import { BaseSprite } from '../lib/sprite/baseSprite';
const { ccclass, property } = _decorator;

@ccclass('LogoSprite')
export class LogoSprite extends BaseSprite {
    constructor() {
        super('LogoSprite', ASSET_KEY.LOGO_SPRITE);
    }
}

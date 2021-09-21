import { _decorator, Component, Node } from 'cc';
import { ASSET_KEY } from '../enum/asset';
import { BaseSprite } from '../lib/sprite/baseSprite';
const { ccclass, property } = _decorator;

@ccclass('JoystickBaseSprite')
export class JoystickBaseSprite extends BaseSprite {
    constructor() {
        super('JoystickBaseSprite', ASSET_KEY.JOYSTICK_BASE_SPRITE);
    }
}
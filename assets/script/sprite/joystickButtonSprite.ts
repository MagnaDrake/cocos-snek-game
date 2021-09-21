import { _decorator, Component, Node } from 'cc';
import { ASSET_KEY } from '../enum/asset';
import { BaseSprite } from '../lib/sprite/baseSprite';
const { ccclass, property } = _decorator;

@ccclass('JoystickButtonSprite')
export class JoystickButtonSprite extends BaseSprite {
    constructor() {
        super('JoystickButtonSprite', ASSET_KEY.JOYSTICK_BUTTON_SPRITE);
    }
}
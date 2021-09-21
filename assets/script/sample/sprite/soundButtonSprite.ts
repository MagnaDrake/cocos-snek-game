import { _decorator, Component, Node } from 'cc';
import { ASSET_KEY } from '../enum/asset';
import { BaseSprite } from '../lib/sprite/baseSprite';
const { ccclass, property } = _decorator;

@ccclass('SoundButtonSprite')
export class SoundButtonSprite extends BaseSprite {
    private readonly soundButtonOffKey = ASSET_KEY.SOUND_OFF_BUTTON_SPRITE;
    private readonly soundButtonOnKey = ASSET_KEY.SOUND_ON_BUTTON_SPRITE;

    constructor() {
        super('SoundButtonSprite', ASSET_KEY.SOUND_ON_BUTTON_SPRITE);
    }

    /**
     * Change button sprite texture to on/off.
     * @param toOn If `true`, set the button texture to `ON`,
     * pass `false` to set to `OFF`
     */
    public setButtonSprite(toOn: boolean) {
        this.setTexture(toOn ? this.soundButtonOnKey : this.soundButtonOffKey);
        this.reload();
    }
}
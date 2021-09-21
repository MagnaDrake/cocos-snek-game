
import { _decorator, Color, tween } from 'cc';
import { ASSET_KEY } from '../enum/asset';
import { BaseSprite } from '../lib/sprite/baseSprite';
const { ccclass, property } = _decorator;

type TPopUpOverlaySprite = Partial<{
    color: Color
    duration: number
    targetOpacity: number
    onStart: () => void
    onComplete: () => void
}>

@ccclass('PopUpOverlaySprite')
export class PopUpOverlaySprite extends BaseSprite {
    constructor() {
        super('PopUpOverlaySprite', ASSET_KEY.WHITE_BOX_SPRITE);
    }

    fadeIn(option?: TPopUpOverlaySprite) {
        const {
            color = new Color(3, 3, 3),
            duration = 0.3,
            targetOpacity = 127,
            onStart,
            onComplete,
        } = option || {}

        this.node.active = true;
        this.reload();
        this.setColor(color);
        this.setOpacity(0);
        tween(this.uiOpacity).to(
            duration, 
            { opacity: targetOpacity },
            {
                onStart,
                onComplete,
            }
        ).start();
    }

    fadeOut(option?: TPopUpOverlaySprite) {
        const {
            color = new Color(3, 3, 3),
            duration = 0.3,
            targetOpacity = 0,
            onStart,
            onComplete,
        } = option || {}

        this.reload();
        this.setColor(color);
        this.setOpacity(255);
        tween(this.uiOpacity).to(
            duration,
            { opacity: targetOpacity },
            {
                onStart,
                onComplete: () => {
                    onComplete?.();
                    this.node.active = false;
                },
            }
        ).start();
    }

}

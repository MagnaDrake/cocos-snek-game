import { _decorator, Component, Node, RichText } from "cc";
import { BasePopUp } from "../lib/object/basePopUp";
import { BaseText } from "../lib/text/baseText";
import { PopUpOverlaySprite } from "../sprite/popUpOverlaySprite";
const { ccclass, property } = _decorator;

@ccclass("DisconnectDialog")
export class DisconnectDialog extends BasePopUp {
    @property(PopUpOverlaySprite)
    public readonly overlaySprite?: PopUpOverlaySprite;

    @property(BaseText)
    public readonly countdownText?: BaseText;

    private countdownTimer = 10;

    show () {
        super.show();
        this.startTimer();
        this.updateText();
    }

    hide () {
        super.hide();
        this.stopTimer();
    }
    
    public setActive (shouldActive: boolean) {
        if (shouldActive) {
            this.show();
            this.overlaySprite?.fadeIn();
        } else {
            this.overlaySprite?.fadeOut();
            this.hide();
        }
    }

    private updateText () {
        this.countdownText?.setText(`Looks like you lost connection!<br/>Try again in ${this.countdownTimer} seconds.`);
    }

    private stopTimer () {
        this.unschedule(this.updateTimer)
    }

    private updateTimer () {
        this.countdownTimer -= 1;
        if (this.countdownTimer === 0) {
            this.stopTimer();
        }
        this.updateText();
    }

    private startTimer (initialTimer: number = 10) {
        this.countdownTimer = initialTimer;
        this.schedule(this.updateTimer, 1)
    }
}

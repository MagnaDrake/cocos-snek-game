import { _decorator, Component, Node, CCString } from 'cc';
import { ButtonClickSfx } from '../audio/buttonClickSfx';
import { TEXT_BUTTON_EVENT } from '../enum/textButton';
import { BaseButton } from '../lib/button/baseButton';
import { BUTTON_EVENT } from '../lib/enum/button';
import { Shopee2021Bold } from '../text/shopee2021Bold';
const { ccclass, property } = _decorator;

@ccclass('TextButton')
export class TextButton extends BaseButton {
    @property(Shopee2021Bold)
    public readonly buttonText?: Shopee2021Bold;

    @property(CCString)
    public readonly textContent: string = '';

    @property(ButtonClickSfx)
    public readonly soundEffect?: ButtonClickSfx;

    start () {
      super.start();

      this.buttonText?.setText(this.textContent);

      this.node.on(BUTTON_EVENT.TOUCH_END, this.playSfx, this);
    }

    private playSfx () {
      this.soundEffect?.playOneShot();
    }
}

import { _decorator, Component, Node, RichText, tween, v3, UITransform, Size } from 'cc';
import { CountScoreSfx } from '../audio/countScoreSfx';
import { GAME_OVER_DIALOG_EVENT } from '../enum/gameOverDialog';
import { BaseButton } from '../lib/button/baseButton';
import { BUTTON_EVENT } from '../lib/enum/button';
import { BASE_DIALOG_EVENT } from '../lib/enum/dialog';
import { BasePopUp } from '../lib/object/basePopUp';
import { BaseText } from '../lib/text/baseText';
import { formatNumberDelimiter } from '../lib/util/textTransformer';
import { DialogBackgroundSprite } from '../sprite/dialogBackgroundSprite';
import { GlowEffectSprite } from '../sprite/glowEffectSprite';
import { PopUpOverlaySprite } from '../sprite/popUpOverlaySprite';
const { ccclass, property } = _decorator;

@ccclass('GameOverDialog')
export class GameOverDialog extends BasePopUp {
    @property(GlowEffectSprite)
    public readonly glowEffectSprite?: GlowEffectSprite;

    @property(BaseText)
    public readonly rankValueText?: BaseText;

    @property(BaseText)
    public readonly pointValueText?: BaseText;

    @property(BaseText)
    public readonly informationText?: BaseText;

    @property(PopUpOverlaySprite)
    public readonly overlaySprite?: PopUpOverlaySprite;

    @property(CountScoreSfx)
    public readonly countScoreSfx?: CountScoreSfx;

    private readonly outlineTextColor: string = '#C86C00';

    @property(BaseButton)
    public readonly playAgainButton?: BaseButton;

    @property(BaseButton)
    public readonly backToLPButton?: BaseButton;

    @property(DialogBackgroundSprite)
    public readonly dialogBackgroundSprite?: DialogBackgroundSprite;

    @property(Node)
    public readonly voucherBoxNode: Node | null = null;

    @property(BaseText)
    public readonly voucherAmountText?: BaseText;

    private uiTransform: UITransform | null = null;

    onLoad () {
      this.glowEffectSprite?.setActive(false);
      this.uiTransform = this.getComponent(UITransform);
      this.setupButtonListeners();
    }

    private setupButtonListeners() {
      this.playAgainButton?.node.on(BUTTON_EVENT.TOUCH_END, this.onPlayButtonClick, this);
      this.backToLPButton?.node.on(BUTTON_EVENT.TOUCH_END, this.onBackToLPButtonClick, this);
    }

    private onPlayButtonClick() {
      this.node.emit(GAME_OVER_DIALOG_EVENT.PLAY_BUTTON_CLICK);
    }

    private onBackToLPButtonClick() {
      this.node.emit(GAME_OVER_DIALOG_EVENT.BACK_TO_LP_BUTTON_CLICK);
    }
    
    showWithData(rank: number, points: number, isKilledBySnake: boolean, voucherIds?: number[] | null) {
      this.setActive(true);
      this.setInformationText(isKilledBySnake);
      this.setRankValue(rank);
      this.setVoucherInfo(voucherIds || null);
      this.node.once(BASE_DIALOG_EVENT.POPPED_IN, () => {
        this.setPointValue(points);
        this.playScoreSfx();
      }, this);
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

    public setRankValue (value: number) {
      const { rankValueText } = this;
      
      rankValueText?.setText(`<outline color=${this.outlineTextColor} width=4>${value}</outline>`);
    }

    private setVoucherInfo (voucherIds: number[] | null) {
      const { dialogBackgroundSprite, uiTransform, voucherAmountText, voucherBoxNode } = this;
      if (!dialogBackgroundSprite || !uiTransform || !voucherBoxNode || !voucherAmountText) return;

      const backgroundWidth = 310;
      const dialogWidth = 298;
      let dialogHeight = 338;
      voucherBoxNode.active = false;

      if (voucherIds) {
        dialogHeight = 411;
        voucherBoxNode.active = true;
        if (voucherIds.length > 1) {
          voucherAmountText.setText(`<outline color=#FFFFFF width=4>x${voucherIds.length}</outline>`)
        }
      }

      uiTransform.setContentSize(new Size(dialogWidth, dialogHeight));
      dialogBackgroundSprite.getComponent(UITransform)?.setContentSize(new Size(backgroundWidth, dialogHeight));

      console.log('___VOUCHER_ID___', { voucherIds });
    }

    private setInformationText (isKilledByPlayer: boolean) {
      const { informationText } = this
      let text = 'Oopss.. You bump other player'
      if (!isKilledByPlayer) {
        text = 'Oops.. You bump the wall'
      }
      informationText?.setText(text);
    }

    private playScoreSfx () {
      this.countScoreSfx?.playOneShot();
    }

    public setPointValue (value: number) {
      const { pointValueText } = this;
      if (!pointValueText) return;

      const duration = 1;

      const setTextValue = (num: number) => {
        const fmtNumber = formatNumberDelimiter(num);
        pointValueText.setText(`<outline color=${this.outlineTextColor} width=4>${fmtNumber}</outline>`);
      }

      const popOutAnimation = () => {
        const { x, y, z } = pointValueText.node.scale;

        tween(pointValueText.node)
          .to(
            0.1,
            {
              scale: v3(x + 0.1, y + 0.1, z + 0.1)
            }
          )
          .to(
            0.1,
            {
              scale: v3(x, y, z)
            }
          )
          .start();
      }

      tween(this.node)
        .to(
          duration,
          {},
          {
            onUpdate: (_, ratio) => {
              if (ratio === undefined) return;
              setTextValue(Math.round(ratio * value));
            },
            onComplete: () => {
              setTextValue(value);
              popOutAnimation();
            }
          }
        )
        .start();
    }
}

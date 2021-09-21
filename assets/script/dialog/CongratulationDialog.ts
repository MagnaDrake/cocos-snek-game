import { _decorator, tween, v3, Size, UITransform, Node } from 'cc';
import { CONGRATULATION_DIALOG_EVENT } from '../enum/congratulationDialog';
import { BaseButton } from '../lib/button/baseButton';
import { BUTTON_EVENT } from '../lib/enum/button';
import { CountScoreSfx } from '../audio/countScoreSfx';
import { BasePopUp } from '../lib/object/basePopUp';
import { BaseText } from '../lib/text/baseText';
import { formatNumberDelimiter, getOrdinalNumber } from '../lib/util/textTransformer';
import { GlowEffectSprite } from '../sprite/glowEffectSprite';
import { PopUpOverlaySprite } from '../sprite/popUpOverlaySprite';
import { BASE_DIALOG_EVENT } from '../lib/enum/dialog';
import { DialogBackgroundSprite } from '../sprite/dialogBackgroundSprite';
const { ccclass, property } = _decorator;

@ccclass('CongratulationDialog')
export class CongratulationDialog extends BasePopUp {
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

    @property(BaseButton)
    public readonly playAgainButton?: BaseButton;

    @property(BaseButton)
    public readonly backToLPButton?: BaseButton;

    private readonly outlineTextColor: string = '#C86C00';

    @property(DialogBackgroundSprite)
    public readonly dialogBackgroundSprite?: DialogBackgroundSprite;

    @property(Node)
    public readonly voucherBoxNode: Node | null = null;

    @property(BaseText)
    public readonly voucherAmountText?: BaseText;

    private uiTransform: UITransform | null = null;

    onLoad () {
      this.glowEffectSprite?.setActive(true);
      this.uiTransform = this.getComponent(UITransform);
      this.setupButtonListeners();
    }

    private setupButtonListeners() {
      this.playAgainButton?.node.on(BUTTON_EVENT.TOUCH_END, this.onPlayButtonClick, this);
      this.backToLPButton?.node.on(BUTTON_EVENT.TOUCH_END, this.onBackToLPButtonClick, this);
    }

    private onPlayButtonClick() {
      this.node.emit(CONGRATULATION_DIALOG_EVENT.PLAY_BUTTON_CLICK);
    }

    private onBackToLPButtonClick() {
      this.node.emit(CONGRATULATION_DIALOG_EVENT.BACK_TO_LP_BUTTON_CLICK);
    }

    showWithData(rank: number, points: number, voucherIds?: number[] | null) {
      this.setActive(true);
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
      } else {
        this.overlaySprite?.fadeOut();
        this.hide();
      }
    }

    private playScoreSfx () {
      this.countScoreSfx?.playOneShot();
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

    public setRankValue (value: number) {
      const { rankValueText } = this;
      
      rankValueText?.setText(`<outline color=${this.outlineTextColor} width=4>${value}</outline>`);
      this.setInformationText(value);
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

    public setInformationText (rank: number) {
      const { informationText } = this
      const ordinalNumber = getOrdinalNumber(rank);
      let text = `You are in the ${ordinalNumber} rank`
      if (rank === 1) {
        text = `Yeay! ${text}!`
      }
      informationText?.setText(text);
    }
}

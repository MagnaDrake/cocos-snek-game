import {
  _decorator,
  Component,
  Node,
  Color,
  Vec3,
  tween,
  Tween,
  RichText,
  v3,
  CCFloat,
} from "cc";
import { ASSET_KEY } from "../enum/asset";
import { BaseText } from "../lib/text/baseText";
const { ccclass, property } = _decorator;

@ccclass("CountdownText")
export class CountdownText extends BaseText {
  @property(Color)
  outlineColor: Color = new Color(0, 0, 0);

  @property(CCFloat)
  outlineWidth: number = 5;

  initialFontSize?: number;
  currentTween?: Tween<Node> | null;

  constructor() {
    super("CountdownText", ASSET_KEY.SHOPEE_2021_BOLD);
  }

  onLoad() {
    super.onLoad();
    this.initialFontSize = this.richText?.fontSize;
  }

  getTextWithOutline(text: string) {
    return `<outline color=${this.outlineColor?.toHEX("#rrggbbaa")} width=${
      // outline width is multiplied to match the scale
      this.outlineWidth * (1 / this.node.scale.x)
    }>${text}</outline>`;
  }

  updateText(text?: string) {
    if (!this.richText) return;
    this.setText(this.getTextWithOutline(text || this.richText.string));
    this.animateText(text);
  }

  animateText(text?: string) {
    this.currentTween = tween(this.richText?.node)
      .to(0.6, {
        scale: v3(1.25, 1.25, 1),
      })
      .to(
        0.4,
        {
          scale: v3(0.5, 0.5, 0.5),
        },
        {
          onComplete: () => {
            this.currentTween = null;
          },
        }
      )
      .start();
  }

  fadeText() {
    if (!this.richText) return;
    // for now use font size because there is a bug
    // that making rich text uneffected by UiOpacity
    // https://discuss.cocos2d-x.org/t/v3-1-0-rich-text-no-longer-affected-by-ui-opacity-component/53699/4
    this.richText.fontSize = 0;
    this.node.destroy();
  }
}

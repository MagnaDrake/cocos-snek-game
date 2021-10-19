import { _decorator, tween, Color } from "cc";
import { TRANSITION_SCREEN_EVENT } from "../enum/transitionScreen";
import { ASSET_KEY } from "../enum/asset";
import { BaseSprite } from "../../lib/sprite/baseSprite";

const { ccclass, property } = _decorator;

@ccclass("TransitionScreen")
export class TransitionScreen extends BaseSprite {
  constructor() {
    super("TransitionScreen", ASSET_KEY.WHITE_BOX_SPRITE);
  }

  fadeIn(duration = 1, color: Color = Color.BLACK, targetOpacity = 255) {
    this.reload();
    this.setColor(color);
    this.setOpacity(0);
    tween(this.uiOpacity)
      .to(
        duration,
        { opacity: targetOpacity },
        {
          onStart: () => {
            this.node.emit(TRANSITION_SCREEN_EVENT.FADE_IN_START);
          },
          onComplete: () => {
            this.node.emit(TRANSITION_SCREEN_EVENT.FADE_IN_COMPLETE);
          },
        }
      )
      .start();
  }

  fadeOut(duration = 1, color: Color = Color.BLACK, targetOpacity = 0) {
    this.reload();
    this.setColor(color);
    this.setOpacity(255);
    tween(this.uiOpacity)
      .to(
        duration,
        { opacity: targetOpacity },
        {
          onStart: () => {
            this.node.emit(TRANSITION_SCREEN_EVENT.FADE_OUT_START);
          },
          onComplete: () => {
            this.node.emit(TRANSITION_SCREEN_EVENT.FADE_OUT_COMPLETE);
          },
        }
      )
      .start();
  }
}

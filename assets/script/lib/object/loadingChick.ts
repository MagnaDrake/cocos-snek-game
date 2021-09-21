import { _decorator, Component, tween, Graphics, UITransform, Vec3 } from "cc";
import { LoadingChickSprite } from "../../sprite/loadingChickSprite";
const { ccclass, property } = _decorator;

@ccclass("LoadingChick")
export class LoadingChick extends Component {
  @property(LoadingChickSprite)
  private loadingChickSprite?: LoadingChickSprite;
  @property(Graphics)
  private chickShadow?: Graphics;

  onLoad() {
    this.drawShadow();
    this.loopChickJumpAnimation();
    this.loopShadowAnimation();
  }

  private loopChickJumpAnimation() {
    const { loadingChickSprite } = this;
    if (!loadingChickSprite) return;

    tween(loadingChickSprite.node)
      .to(0.5, { position: new Vec3(0, 30, 0) }, { easing: "circOut" })
      .to(0.5, { position: new Vec3(0, 0, 0) }, { easing: "circIn" })
      .union()
      .repeatForever()
      .start();
  }

  private loopShadowAnimation() {
    const { chickShadow } = this;
    if (!chickShadow) return;

    tween(chickShadow.node)
      .to(0.5, { scale: new Vec3(0, 0, 0) }, { easing: "circOut" })
      .to(0.5, { scale: new Vec3(1, 1, 0) }, { easing: "circIn" })
      .union()
      .repeatForever()
      .start();
  }

  private getShadowConfig() {
    const uiTransform = this.chickShadow?.getComponent(UITransform);
    if (!uiTransform) return undefined;
    const { width, height } = uiTransform;

    return {
      cx: 0,
      cy: 0,
      rx: width * 0.5,
      ry: height * 0.5,
    };
  }

  private drawShadow() {
    const { chickShadow } = this;
    const config = this.getShadowConfig();

    if (!config || !chickShadow) return;
    const { cx, cy, rx, ry } = config;

    chickShadow.ellipse(cx, cy, rx, ry);
    chickShadow.fill();
  }
}

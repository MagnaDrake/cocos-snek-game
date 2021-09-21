import { ToastBackground } from "./ToastBackground";
import { BaseLabel } from "./../text/baseLabel";
import { _decorator, Component, tween, Vec3, easing } from "cc";
import { TToastOption } from "../interface/toast";
import { checkExist } from "../util/checkExist";
const { ccclass, property } = _decorator;

@ccclass("ToastItem")
export class ToastItem extends Component {
  @property(BaseLabel)
  toastLabel?: BaseLabel;

  @property(ToastBackground)
  toastBackground?: ToastBackground;

  option?: TToastOption;

  init(option: Partial<TToastOption>) {
    const DEFAULT_OPTION: TToastOption = {
      duration: 2,
      animateInEasingFn: easing.bounceOut,
      animateOutEasingFn: easing.circOut,
      animateInDuration: 0.8,
      animateOutDuration: 0.5,
    };
    const combinedOption = {
      ...DEFAULT_OPTION,
      ...option,
    };
    this.option = combinedOption;
  }

  animate() {
    const option = checkExist(this.option, "Option not exist on ToastItem");
    this.node.setScale(new Vec3(0, 0, 0));
    tween(this.node)
      .to(
        option.animateInDuration,
        {
          scale: new Vec3(1, 1, 1),
        },
        {
          easing: option.animateInEasingFn,
        }
      )
      .start();
  }

  animateOut() {
    const option = checkExist(this.option, "Option not exist on ToastItem");
    tween(this.node)
      .to(
        option.animateOutDuration,
        {
          scale: new Vec3(0, 0, 0),
        },
        {
          easing: option.animateOutEasingFn,
          onComplete: () => {
            console.log("COMPLETE");
            this.node.destroy();
          },
        }
      )
      .start();
  }

  setText(text: string) {
    const option = checkExist(this.option, "Option not exist on ToastItem");
    const toastLabel = checkExist(
      this.toastLabel,
      "ToastLabel not exist on ToastItem"
    );
    toastLabel.setText(text);
    this.animate();
    this.scheduleOnce(() => this.toastBackground?.drawToastBackground(), 0);
    this.scheduleOnce(() => this.animateOut(), option.duration);
  }
}

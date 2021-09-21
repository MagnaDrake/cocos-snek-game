import { BaseLabel } from "./../text/baseLabel";
import {
  _decorator,
  Component,
  Node,
  Graphics,
  UITransform,
  Layout,
  Label,
} from "cc";
import { checkExist } from "../util/checkExist";
const { ccclass, property } = _decorator;

@ccclass("ToastBackground")
export class ToastBackground extends Component {
  @property(BaseLabel)
  toastLabel?: BaseLabel;

  lastLabelHeight: number = 0;
  onLoad() {
    this.setupHeight();
  }

  setupHeight() {
    const toastLabelUiTransform = checkExist(
      this.toastLabel?.getComponent(UITransform),
      "toastLabelUiTransform undefined on setupHeight"
    );
    this.lastLabelHeight = toastLabelUiTransform.height;
  }

  // TO-DO: if this is called multiple times, better move getComponent to onLoad
  drawToastBackground() {
    const toastBackground = this.getComponent(Graphics);
    const uiTransform = this.getComponent(UITransform);

    if (!toastBackground || !uiTransform) return;

    const { width, height: transformHeight } = uiTransform;

    toastBackground.roundRect(
      width * -0.5,
      transformHeight * -0.5,
      width,
      transformHeight,
      5
    );
    toastBackground.fill();
  }
}

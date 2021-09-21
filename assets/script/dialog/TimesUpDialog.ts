import { _decorator, Component, Node, RichText } from "cc";
import { BasePopUp } from "../lib/object/basePopUp";
import { BaseText } from "../lib/text/baseText";
import { PopUpOverlaySprite } from "../sprite/popUpOverlaySprite";
const { ccclass, property } = _decorator;

@ccclass("TimesUpDialog")
export class TimesUpDialog extends BasePopUp {
  @property(BaseText)
  private timesUpText?: BaseText;

  @property(PopUpOverlaySprite)
  private overlaySprite?: PopUpOverlaySprite;
  

  start() {
    this.show();
    this.overlaySprite?.fadeIn();
  }

  public shouldShow(value: boolean) {
    this.node.active = value;
  }
}

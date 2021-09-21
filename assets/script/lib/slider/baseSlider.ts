import { EDIT_BOX_EVENT } from "./../enum/editBox";
import { _decorator, Component, Node, Slider } from "cc";
import { SLIDER_EVENT } from "../enum/slider";
const { ccclass, property } = _decorator;

@ccclass("BaseSlider")
export class BaseSlider extends Slider {
  onLoad() {
    this.node.on("slide", this.registerOnSLideEvent, this);
  }

  private registerOnSLideEvent(...params: any[]) {
    this.node.emit(SLIDER_EVENT.SLIDE, ...params);
  }
}

import { _decorator, Component, Node, Button } from "cc";
import { BUTTON_EVENT } from "../enum/button";
const { ccclass, property } = _decorator;

@ccclass("BaseButton")
export class BaseButton extends Button {
  start() {
    this.registerTouchEvent();
  }

  private registerTouchEvent() {
    this.node.on(Node.EventType.TOUCH_END, () => {
      this.node.emit(BUTTON_EVENT.TOUCH_END);
    });
  }

  public unregisterTouchEvent() {
    this.node.off(Node.EventType.TOUCH_END);
  }
}

import { EDIT_BOX_EVENT } from "./../enum/editBox";
import { _decorator, Component, Node, Button, EditBox, EventHandler } from "cc";
import { BUTTON_EVENT } from "../enum/button";
const { ccclass, property } = _decorator;

@ccclass("BaseEditBox")
export class BaseEditBox extends EditBox {
  onLoad() {
    this.node.on("text-changed", this.registerOnTextChanged, this);
  }

  private registerOnTextChanged(...params: any[]) {
    this.node.emit(EDIT_BOX_EVENT.CHANGED_TEXT, ...params);
  }
}

import { _decorator, Component, Node, Color } from "cc";
import { ASSET_KEY } from "../enum/asset";
import { BaseSprite } from "../../lib/sprite/baseSprite";
const { ccclass, property } = _decorator;

// generic button 'prefab' class
@ccclass("ButtonSprite")
export class ButtonSprite extends BaseSprite {
  @property(Color)
  public buttonColor = new Color(255, 255, 255);

  constructor() {
    super("ButtonSprite", ASSET_KEY.WHITE_BOX_SPRITE);
  }

  onLoad() {
    super.onLoad();
    this.setColor(this.buttonColor);
  }
}

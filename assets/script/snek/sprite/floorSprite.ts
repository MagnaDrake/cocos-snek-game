import { _decorator, Component, Node } from "cc";
import { BaseSprite } from "../../lib/sprite/baseSprite";
import { ISprite } from "../interface/ISprite";
import { ASSET_KEY } from "../enum/asset";

const { ccclass, property } = _decorator;

@ccclass("FloorSprite")
export class FloorSprite extends BaseSprite {
  constructor() {
    super("FloorSprite", ASSET_KEY.TILE_SPRITESHEET, 0);
  }

  public adjustTexture(isEven: boolean) {
    if (isEven) {
      this.setFrame(0);
    } else {
      this.setFrame(1);
    }
    this.reload();
  }
}

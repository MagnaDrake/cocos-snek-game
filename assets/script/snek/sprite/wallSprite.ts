import { _decorator, Component, Node } from "cc";
import { ASSET_KEY } from "../enum/asset";
import { BaseSprite } from "../../lib/sprite/baseSprite";
import { ITileSprite } from "../interface/ITile";

const { ccclass, property } = _decorator;

@ccclass("WallSprite")
export class WallSprite extends BaseSprite implements ITileSprite {
  constructor() {
    super("WallSprite", ASSET_KEY.WALL_SPRITE);
  }

  public adjustTexture(isEven: boolean) {
    // do nothing for now, walls cannot be adjusted
  }
}

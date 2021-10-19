import { _decorator, Component, Node } from "cc";
import { ASSET_KEY } from "../enum/asset";
import { BaseSprite } from "../../lib/sprite/baseSprite";
import { ISprite } from "../interface/ISprite";

const { ccclass, property } = _decorator;

@ccclass("WallSprite")
export class WallSprite extends BaseSprite {
  constructor() {
    super("WallSprite", ASSET_KEY.WALL_SPRITE);
  }

  public adjustTexture() {
    // do nothing for now, walls cannot be adjusted
  }
}

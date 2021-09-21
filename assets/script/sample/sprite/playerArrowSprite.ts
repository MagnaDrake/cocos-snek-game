import { _decorator, Component, Node } from "cc";
import { ASSET_KEY } from "../enum/asset";
import { BaseSprite } from "../lib/sprite/baseSprite";
const { ccclass, property } = _decorator;

@ccclass("PlayerArrowSprite")
export class PlayerArrowSprite extends BaseSprite {
  constructor() {
    super("PlayerArrowSprite", ASSET_KEY.PLAYER_ARROW_SPRITE);
  }
}

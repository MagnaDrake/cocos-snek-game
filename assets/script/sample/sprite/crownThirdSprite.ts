import { _decorator, Component, Node } from "cc";
import { ASSET_KEY } from "../enum/asset";
import { BaseSprite } from "../lib/sprite/baseSprite";
const { ccclass, property } = _decorator;

@ccclass("CrownThirdSprite")
export class CrownThirdSprite extends BaseSprite {
  constructor() {
    super("CrownThirdSprite", ASSET_KEY.CROWN_THIRD_SPRITE);
  }
}

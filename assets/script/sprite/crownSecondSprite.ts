import { _decorator, Component, Node } from "cc";
import { ASSET_KEY } from "../enum/asset";
import { BaseSprite } from "../lib/sprite/baseSprite";
const { ccclass, property } = _decorator;

@ccclass("CrownSecondSprite")
export class CrownSecondSprite extends BaseSprite {
  constructor() {
    super("CrownSecondSprite", ASSET_KEY.CROWN_SECOND_SPRITE);
  }
}

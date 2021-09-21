import { _decorator, Component, Node, Color } from "cc";
import { ASSET_KEY } from "../enum/asset";
import { BaseSprite } from "../lib/sprite/baseSprite";
const { ccclass, property } = _decorator;

@ccclass("CrownFirstSprite")
export class CrownFirstSprite extends BaseSprite {
  constructor() {
    super("CrownFirstSprite", ASSET_KEY.CROWN_FIRST_SPRITE);
  }
}

import { _decorator, Component, Node, tween, Color } from "cc";
import { ASSET_KEY } from "../enum/asset";
import { COUNTDOWN_EVENT } from "../enum/countdown";
import { BaseSprite } from "../lib/sprite/baseSprite";
const { ccclass, property } = _decorator;

@ccclass("CountdownBackgroundSprite")
export class CountdownBackgroundSprite extends BaseSprite {
  constructor() {
    super("CountdownBackgroundSprite", ASSET_KEY.WHITE_BOX_SPRITE);
  }
}

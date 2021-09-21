import { _decorator, Component, Node, tween, Color } from "cc";
import { ASSET_KEY } from "../enum/asset";
import { COUNTDOWN_EVENT } from "../enum/countdown";
import { BaseSprite } from "../lib/sprite/baseSprite";
const { ccclass, property } = _decorator;

@ccclass("CountdownMissionIcon")
export class CountdownMissionIcon extends BaseSprite {
  constructor() {
    super("CountdownMissionIcon", ASSET_KEY.MISSION_ICON);
  }
}

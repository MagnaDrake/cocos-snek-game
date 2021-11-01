import { _decorator, Component, Node } from "cc";
import { BaseSprite } from "../../lib/sprite/baseSprite";
import { ISprite } from "../interface/ISprite";
import { ASSET_KEY } from "../enum/asset";

const { ccclass, property } = _decorator;

@ccclass("AppleSprite")
export class AppleSprite extends BaseSprite {
  constructor() {
    super("AppleSprite", ASSET_KEY.APPLE_SPRITE);
  }
}

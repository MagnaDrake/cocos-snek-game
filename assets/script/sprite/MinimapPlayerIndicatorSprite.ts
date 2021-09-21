import { _decorator, Component, Node } from "cc";
import { ASSET_KEY } from "../enum/asset";
import { BaseSprite } from "../lib/sprite/baseSprite";
const { ccclass, property } = _decorator;

@ccclass("MinimapPlayerIndicatorSprite")
export class MinimapPlayerIndicatorSprite extends BaseSprite {
  constructor() {
    super("MinimapPlayerIndicatorSprite", ASSET_KEY.MINIMAP_PLAYER);
  }
}

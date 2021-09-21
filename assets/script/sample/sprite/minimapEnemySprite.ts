import { _decorator, Component, Node } from "cc";
import { ASSET_KEY } from "../enum/asset";
import { BaseSprite } from "../lib/sprite/baseSprite";
import { BaseSwapableSprite } from "../lib/sprite/baseSwapableSprite";
const { ccclass, property } = _decorator;

const map = {
  near: ASSET_KEY.MINIMAP_ENEMY_NEAR,
  far: ASSET_KEY.MINIMAP_ENEMY_FAR,
} as const;
@ccclass("MinimapEnemySprite")
export class MinimapEnemySprite extends BaseSwapableSprite<typeof map> {
  constructor() {
    super("MinimapEnemySprite", map);
  }
}

import { _decorator, Component, Node } from "cc";
import { ASSET_KEY } from "../enum/asset";
import { BaseSprite } from "../lib/sprite/baseSprite";
import { BaseSwapableSprite } from "../lib/sprite/baseSwapableSprite";
const { ccclass, property } = _decorator;

const map = {
  near: ASSET_KEY.VOUCHER_INDICATOR_NEAR,
  far: ASSET_KEY.VOUCHER_INDICATOR_FAR,
} as const;

@ccclass("MinimapVoucherIndicatorSprite")
export class MinimapVoucherIndicatorSprite extends BaseSwapableSprite<
  typeof map
> {
  constructor() {
    super("MinimapVoucherIndicatorSprite", map);
  }
}

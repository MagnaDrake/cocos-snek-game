import { _decorator } from "cc";
import { BaseSprite } from "./baseSprite";
const { ccclass, property } = _decorator;

@ccclass("BaseSwapableSprite")
export class BaseSwapableSprite<
  T extends Record<string, string>
> extends BaseSprite {
  private assetMap: T;

  constructor(name: string, assetMap: T, firstAssetKeyParam?: string) {
    const firstAssetMapKey = firstAssetKeyParam
      ? firstAssetKeyParam
      : Object.keys(assetMap)[0];
    super(name, assetMap[firstAssetMapKey]);
    this.assetMap = assetMap;
  }

  swapSpriteTo(key: keyof typeof this.assetMap) {
    this.setTexture(this.assetMap[key as string]);
    this.reload();
  }
}

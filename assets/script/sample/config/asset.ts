import { ASSET_TYPE } from "../../lib/enum/asset";
import { AssetConfig } from "../../lib/interface/asset";
import { ASSET_KEY } from "../enum/asset";

export function getAssets() {
    const assets = new Array<AssetConfig>();

    // Early sprites (used for loading screen)
    assets.push({
        key: ASSET_KEY.TOMATO_SPRITE,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'sample/image/tomato'
    });

    return assets;
}
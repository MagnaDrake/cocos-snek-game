import { ASSET_TYPE } from "../../lib/enum/asset";
import { AssetConfig } from "../../lib/interface/asset";
import { ASSET_KEY } from "../enum/asset";

export function getAssets() {
    const assets = new Array<AssetConfig>();
    
    // Sprites
    assets.push({
        key: ASSET_KEY.TOMATO_SPRITE,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'sample/image/tomato',
    });
    assets.push({
        key: ASSET_KEY.WHITE_BOX_SPRITE,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'sample/image/white_box',
    });

    // Fonts
    assets.push({
        key: ASSET_KEY.SHOPEE_2021_BOLD_FONT,
        type: ASSET_TYPE.FONT,
        url: '',
        localUrl: 'sample/font/Shopee2021/Shopee2021-Bold'
    });

    return assets;
}
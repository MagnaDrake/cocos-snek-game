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
    assets.push({
        key: ASSET_KEY.SOUND_ON_BUTTON_SPRITE,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'sample/image/sound_on_button',
    });
    assets.push({
        key: ASSET_KEY.SOUND_OFF_BUTTON_SPRITE,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'sample/image/sound_off_button',
    });

    // Fonts
    assets.push({
        key: ASSET_KEY.SHOPEE_2021_BOLD_FONT,
        type: ASSET_TYPE.FONT,
        url: '',
        localUrl: 'sample/font/Shopee2021/Shopee2021-Bold',
    });

    // Music
    assets.push({
        key: ASSET_KEY.BG_MUSIC,
        type: ASSET_TYPE.AUDIO,
        url: '',
        localUrl: 'sample/audio/bg_music',
    });

    return assets;
}
import { ASSET_TYPE } from "../lib/enum/asset";
import { AssetConfig } from "../lib/interface/asset";
import { ASSET_KEY } from "../enum/asset";

function getShopeeAssetUrl(url: string) {
    return `https://cf.shopee.co.id/file/${url}`;
}

export function getAssets() {
    const assets = new Array<AssetConfig>();

    // Early sprites (used for loading screen)
    assets.push({
        key: ASSET_KEY.PRELOAD_BACKGROUND_SPRITE,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'image/preload_bg'
    });
    assets.push({
        key: ASSET_KEY.WHITE_BOX_SPRITE,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'image/white_box'
    });

    // Sprites
    assets.push({
        key: ASSET_KEY.TITLE_BACKGROUND_SPRITE,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'image/title_bg'
    });
    assets.push({
        key: ASSET_KEY.GAME_BACKGROUND_SPRITE,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'image/game_bg'
    });
    assets.push({
        key: ASSET_KEY.LOGO_SPRITE,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'image/logo'
    });
    assets.push({
        key: ASSET_KEY.PRIMARY_BUTTON_SPRITE,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'image/button_primary'
    });
    assets.push({
        key: ASSET_KEY.SECONDARY_BUTTON_SPRITE,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'image/button_secondary'
    });
    assets.push({
        key: ASSET_KEY.BACK_BUTTON_SPRITE,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'image/back_button'
    });
    assets.push({
        key: ASSET_KEY.QUESTION_BUTTON_SPRITE,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'image/question_button'
    });
    assets.push({
        key: ASSET_KEY.SOUND_OFF_BUTTON_SPRITE,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'image/sound_off_button'
    });
    assets.push({
        key: ASSET_KEY.SOUND_ON_BUTTON_SPRITE,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'image/sound_on_button'
    });
    assets.push({
        key: ASSET_KEY.JOYSTICK_BASE_SPRITE,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'image/joystick_base'
    });
    assets.push({
        key: ASSET_KEY.JOYSTICK_BUTTON_SPRITE,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'image/joystick_button'
    });
    assets.push({
        key: ASSET_KEY.BIG_CHICKEN_RED_SPRITE,
        type: ASSET_TYPE.SPRITESHEET,
        url: '',
        localUrl: 'image/big_chicken_red',
        config: {
            frameWidth: 154,
            frameHeight: 145,
            paddingX: 0,
        }
    });
    assets.push({
        key: ASSET_KEY.BIG_CHICKEN_BLUE_SPRITE,
        type: ASSET_TYPE.SPRITESHEET,
        url: '',
        localUrl: 'image/big_chicken_blue',
        config: {
            frameWidth: 154,
            frameHeight: 145,
            paddingX: 0,
        }
    });
    assets.push({
        key: ASSET_KEY.SMALL_CHICK_YELLOW_SPRITE,
        type: ASSET_TYPE.SPRITESHEET,
        url: '',
        localUrl: 'image/small_chick_yellow',
        config: {
            frameWidth: 117,
            frameHeight: 107,
            paddingX: 0,
        }
    });
    assets.push({
        key: ASSET_KEY.SMALL_CHICK_BLUE_SPRITE,
        type: ASSET_TYPE.SPRITESHEET,
        url: '',
        localUrl: 'image/small_chick_blue',
        config: {
            frameWidth: 117,
            frameHeight: 107,
            paddingX: 0,
        }
    });
    assets.push({
        key: ASSET_KEY.FOOD_TOMATO_SPRITE,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'image/food_tomato'
    });
    assets.push({
        key: ASSET_KEY.FOOD_CORN_SPRITE,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'image/food_corn'
    });
    assets.push({
        key: ASSET_KEY.FOOD_EGGPLANT_SPRITE,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'image/food_eggplant'
    });
    assets.push({
        key: ASSET_KEY.FOOD_CARROT_SPRITE,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'image/food_carrot'
    });
    assets.push({
        key: ASSET_KEY.FOOD_TURNIP_SPRITE,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'image/food_turnip'
    });
    assets.push({
        key: ASSET_KEY.FOOD_VOUCHER_SPRITE,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'image/food_voucher'
    });
    assets.push({
        key: ASSET_KEY.TIMER_SPRITE,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'image/timer'
    });
    assets.push({
        key: ASSET_KEY.DIALOG_BACKGROUND_SPRITE,
        type: ASSET_TYPE.STRETCHABLE_IMAGE,
        url: '',
        localUrl: 'image/dialog_background',
        config: {
            insetBottom: 40,
            insetLeft: 40,
            insetRight: 40,
            insetTop: 40,
        }
    });
    assets.push({
        key: ASSET_KEY.DIALOG_HEADER_BACKGROUND_SPRITE,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'image/dialog_header_background'
    });
    assets.push({
        key: ASSET_KEY.GLOW_EFFECT_SPRITE,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'image/glow_effect'
    });
    assets.push({
        key: ASSET_KEY.CROWN_FIRST_SPRITE,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'image/crown_first'
    });
    assets.push({
        key: ASSET_KEY.CROWN_SECOND_SPRITE,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'image/crown_second'
    });
    assets.push({
        key: ASSET_KEY.CROWN_THIRD_SPRITE,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'image/crown_third'
    });
    assets.push({
        key: ASSET_KEY.PLAYER_ARROW_SPRITE,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'image/player_arrow'
    });
    assets.push({
        key: ASSET_KEY.FENCE_SIDE_HORIZONTAL_SPRITE,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'image/fence_side_horizontal'
    });
    assets.push({
        key: ASSET_KEY.FENCE_SIDE_VERTICAL_SPRITE,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'image/fence_side_vertical'
    });
    assets.push({
        key: ASSET_KEY.FENCE_CORNER_SPRITE,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'image/fence_corner'
    });
    assets.push({
        key: ASSET_KEY.FENCE_EXTRA_SPRITE,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'image/fence_extra'
    });

    // Font
    assets.push({
        key: ASSET_KEY.SHOPEE_2021_BOLD,
        type: ASSET_TYPE.FONT,
        url: '',
        localUrl: 'font/Shopee2021/Shopee2021-Bold'
    });
    assets.push({
        key: ASSET_KEY.SHOPEE_2021_MEDIUM,
        type: ASSET_TYPE.FONT,
        url: '',
        localUrl: 'font/Shopee2021/Shopee2021-Medium'
    });

    assets.push({
        key: ASSET_KEY.LOADING_CHICK_SPRITE,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'image/loading_chick'
    });

    assets.push({
        key: ASSET_KEY.MISSION_ICON,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'image/mission_icon'
    });

    // Audio
    assets.push({
        key: ASSET_KEY.BG_MUSIC,
        type: ASSET_TYPE.AUDIO,
        url: '',
        localUrl: 'audio/music_background',
    });
    assets.push({
        key: ASSET_KEY.BUTTON_CLICK_SFX,
        type: ASSET_TYPE.AUDIO,
        url: '',
        localUrl: 'audio/sfx_click',
    });
    assets.push({
        key: ASSET_KEY.COUNT_SCORE_SFX,
        type: ASSET_TYPE.AUDIO,
        url: '',
        localUrl: 'audio/sfx_count_score',
    });
    assets.push({
        key: ASSET_KEY.DIE_SFX,
        type: ASSET_TYPE.AUDIO,
        url: '',
        localUrl: 'audio/sfx_die',
    });
    assets.push({
        key: ASSET_KEY.EAT_SFX,
        type: ASSET_TYPE.AUDIO,
        url: '',
        localUrl: 'audio/sfx_eat',
    });
    assets.push({
        key: ASSET_KEY.EAT_VOUCHER_SFX,
        type: ASSET_TYPE.AUDIO,
        url: '',
        localUrl: 'audio/sfx_eat_voucher',
    });
    assets.push({
        key: ASSET_KEY.MINIMAP_PLAYER,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'image/minimap_player_indicator',
    });
    assets.push({
        key: ASSET_KEY.MINIMAP_ENEMY_NEAR,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'image/minimap_enemy_near',
    });
    assets.push({
        key: ASSET_KEY.MINIMAP_ENEMY_FAR,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'image/minimap_enemy_far',
    });

    assets.push({
        key: ASSET_KEY.VOUCHER_INDICATOR_FAR,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'image/voucher_indicator_far',
    });

    assets.push({
        key: ASSET_KEY.VOUCHER_INDICATOR_NEAR,
        type: ASSET_TYPE.IMAGE,
        url: '',
        localUrl: 'image/voucher_indicator_near',
    });

    return assets;
}
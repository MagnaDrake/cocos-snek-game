import { ASSET_TYPE } from "../../lib/enum/asset";
import { AssetConfig } from "../../lib/interface/asset";
import { ASSET_KEY } from "../enum/asset";

// Load assets from here
// input asset keys on ASSET_KEY enum
export function getAssets() {
  const assets = new Array<AssetConfig>();

  // Images
  assets.push({
    key: ASSET_KEY.TOMATO_SPRITE,
    type: ASSET_TYPE.IMAGE,
    url: "",
    localUrl: "sample/image/tomato",
  });
  assets.push({
    key: ASSET_KEY.WHITE_BOX_SPRITE,
    type: ASSET_TYPE.IMAGE,
    url: "",
    localUrl: "sample/image/white_box",
  });
  assets.push({
    key: ASSET_KEY.SOUND_ON_BUTTON_SPRITE,
    type: ASSET_TYPE.IMAGE,
    url: "",
    localUrl: "sample/image/sound_on_button",
  });
  assets.push({
    key: ASSET_KEY.SOUND_OFF_BUTTON_SPRITE,
    type: ASSET_TYPE.IMAGE,
    url: "",
    localUrl: "sample/image/sound_off_button",
  });

  assets.push({
    key: ASSET_KEY.APPLE_SPRITE,
    type: ASSET_TYPE.IMAGE,
    url: "",
    localUrl: "snek/sprite_apple",
  });
  assets.push({
    key: ASSET_KEY.TROPHY_SPRITE,
    type: ASSET_TYPE.IMAGE,
    url: "",
    localUrl: "snek/image/sprite_trophy",
  });
  assets.push({
    key: ASSET_KEY.WALL_SPRITE,
    type: ASSET_TYPE.IMAGE,
    url: "",
    localUrl: "snek/image/sprite_wall",
  });
  assets.push({
    key: ASSET_KEY.TILE_SPRITE,
    type: ASSET_TYPE.IMAGE,
    url: "",
    localUrl: "snek/image/sprite_tile",
  });

  // Spritesheets
  assets.push({
    key: ASSET_KEY.BLACK_MAGE_SPRITE,
    type: ASSET_TYPE.SPRITESHEET,
    url: "",
    localUrl: "snek/sample/image/black_mage",
    config: {
      frameWidth: 86,
      frameHeight: 87,
      paddingX: 5,
      paddingY: 1,
    },
  });
  assets.push({
    key: ASSET_KEY.KEYPAD_SPRITESHEET,
    type: ASSET_TYPE.SPRITESHEET,
    url: "",
    localUrl: "snek/image/keypad",
    config: {
      frameWidth: 124,
      frameHeight: 124,
      paddingX: 20,
      paddingY: 16,
    },
  });
  assets.push({
    key: ASSET_KEY.SNAKE_SPRITESHEET,
    type: ASSET_TYPE.SPRITESHEET,
    url: "",
    localUrl: "snek/image/spritesheet_round",
    config: {
      frameWidth: 96,
      frameHeight: 96,
      paddingX: 1,
    },
  });

  // Fonts
  assets.push({
    key: ASSET_KEY.SHOPEE_2021_BOLD_FONT,
    type: ASSET_TYPE.FONT,
    url: "",
    localUrl: "sample/font/Shopee2021/Shopee2021-Bold",
  });

  // Music
  assets.push({
    key: ASSET_KEY.BG_MUSIC,
    type: ASSET_TYPE.AUDIO,
    url: "",
    localUrl: "sample/audio/bg_music",
  });

  assets.push({
    key: ASSET_KEY.BG_SOUND_2,
    type: ASSET_TYPE.AUDIO,
    url: "",
    localUrl: "snek/bg-music",
  });

  assets.push({
    key: ASSET_KEY.EAT_SFX,
    type: ASSET_TYPE.AUDIO,
    url: "",
    localUrl: "snek/eat",
  });
  assets.push({
    key: ASSET_KEY.TURN_SFX,
    type: ASSET_TYPE.AUDIO,
    url: "",
    localUrl: "snek/turn",
  });
  assets.push({
    key: ASSET_KEY.CRASH_SFX,
    type: ASSET_TYPE.AUDIO,
    url: "",
    localUrl: "snek/crash",
  });
  assets.push({
    key: ASSET_KEY.SILENCE_SFX,
    type: ASSET_TYPE.AUDIO,
    url: "",
    localUrl: "snek/silence",
  });

  return assets;
}

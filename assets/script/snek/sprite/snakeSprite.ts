import { _decorator } from "cc";
import { SNAKE_BODY_PART } from "../enum/snake";
import { ASSET_KEY } from "../enum/asset";
import { BaseSprite } from "../../lib/sprite/baseSprite";
const { ccclass, property } = _decorator;

@ccclass("SnakeSprite")
export class SnakeSprite extends BaseSprite {
  constructor() {
    super("SnakeSprite", ASSET_KEY.SNAKE_SPRITESHEET, 0);
  }

  public adjustTexture(part: SNAKE_BODY_PART) {
    switch (part) {
      case SNAKE_BODY_PART.HEAD: {
        this.setFrame(0);
        break;
      }

      case SNAKE_BODY_PART.BODY: {
        this.setFrame(3);
        break;
      }

      case SNAKE_BODY_PART.BODY_FAT: {
        this.setFrame(1);
        break;
      }

      case SNAKE_BODY_PART.TAIL: {
        this.setFrame(2);
        break;
      }

      default: {
        break;
      }
    }
    this.reload();
  }
}

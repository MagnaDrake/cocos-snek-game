import { SpritePool } from "./../pool/spritePool";
import { GameConfiguration } from "./../gameConfiguration";
import { _decorator, Component, Node, Sprite, v2, misc, UITransform } from "cc";
import { PlayerManager } from "../playerManager";
import { checkExist } from "../../lib/util/checkExist";
import {
  TMinimapIndicator,
  TMinimapIndicatorPosition,
} from "../../interface/minimap";
import { MinimapBoundingBoxCategory } from "../../enum/minimap";
import { PLAYER_MANAGER_EVENT } from "../../enum/playerManager";
import { calculateAngleBetweenTwoDots } from "../../lib/util/algorithm";
import { BaseSprite } from "../../lib/sprite/baseSprite";
import { MinimapEnemySprite } from "../../sprite/minimapEnemySprite";
import { PlayerInstance } from "../../interface/player";
const { ccclass, property } = _decorator;

@ccclass("Minimap")
export class Minimap extends Component {
  @property(GameConfiguration)
  gameConfiguration?: GameConfiguration;
  @property(PlayerManager)
  playerManager?: PlayerManager;

  ratio: number = 0.5;
  minimapRadius: number = 0;

  onLoad() {
    const uiTransform = this.getComponent(UITransform);
    if (uiTransform) {
      this.minimapRadius = uiTransform.width / 2;
    }
  }

  getArenaSize() {
    const gameConfiguration = checkExist(this.gameConfiguration);
    const config = gameConfiguration.getConfiguration();
    if (!config) {
      return {
        width: 0,
        height: 0,
      };
    }
    return {
      width: config.width,
      height: config.height,
    };
  }

  getMinimapToMapRatio() {
    const MINIMAP_OBJECT_WIDTH = this.minimapRadius * 2;
    const MINIMAP_OBJECT_HEIGHT = this.minimapRadius * 2;
    const gameConfiguration = checkExist(this.gameConfiguration);
    const config = gameConfiguration.getConfiguration();
    if (!config) {
      return {
        width: 1,
        height: 1,
      };
    }
    return {
      width: MINIMAP_OBJECT_WIDTH / (config.width * this.ratio),
      height: MINIMAP_OBJECT_HEIGHT / (config.height * this.ratio),
    };
  }

  getRadiusSize() {
    const arenaSize = this.getArenaSize();
    // TODO: Change from config
    const ratio = this.ratio;
    return {
      width: arenaSize.width * ratio,
      height: arenaSize.height * ratio,
    };
  }

  getInnerRadiusSize() {
    const arenaSize = this.getArenaSize();
    // TODO: Change from config
    const ratio = this.ratio;
    return {
      width: (arenaSize.width * ratio) / 2,
      height: (arenaSize.height * ratio) / 2,
    };
  }

  getMainPlayerBoundingBox(type: "inner" | "outer") {
    const playerManager = checkExist(this.playerManager);
    const playerInstance = playerManager.getMainPlayer()?.object.getHead();
    const { width, height } =
      type === "inner" ? this.getInnerRadiusSize() : this.getRadiusSize();
    if (!playerInstance) {
      return null;
    }

    const minX = playerInstance.position.x - width;
    const minY = playerInstance.position.y - height;
    const maxX = playerInstance.position.x + width;
    const maxY = playerInstance.position.y + height;

    return {
      minX,
      minY,
      maxX,
      maxY,
    };
  }
  checkEnemyBoundingBoxCategory(enemyNode: Node) {
    const playerManager = checkExist(this.playerManager);
    const innerBoundingBox = this.getMainPlayerBoundingBox("inner");
    const outerBoundingBox = this.getMainPlayerBoundingBox("outer");
    if (!outerBoundingBox || !innerBoundingBox) return null;
    // check if inner radius
    const { x: enemyX, y: enemyY } = enemyNode.position;
    const {
      minX: innerMinX,
      minY: innerMinY,
      maxX: innerMaxX,
      maxY: innerMaxY,
    } = innerBoundingBox;
    const {
      minX: mainMinX,
      minY: mainMinY,
      maxX: mainMaxX,
      maxY: mainMaxY,
    } = outerBoundingBox;
    const isInInnerBoundingBox =
      enemyX > innerMinX &&
      enemyX < innerMaxX &&
      enemyY > innerMinY &&
      enemyY < innerMaxY;
    const isInOuterBoundingBox =
      enemyX > mainMinX &&
      enemyX < mainMaxX &&
      enemyY > mainMinY &&
      enemyY < mainMaxY;
    const { width: ratioWidth, height: ratioHeight } =
      this.getMinimapToMapRatio();
    const playerInstance = playerManager.getMainPlayer()?.object.getHead();
    if (!playerInstance) {
      return null;
    }
    let positionX = (enemyX - playerInstance.position.x) * ratioWidth;
    let positionY = (enemyY - playerInstance.position.y) * ratioHeight;

    const magnitude = Math.min(
      Math.sqrt(Math.pow(positionX, 2.0) + Math.pow(positionY, 2.0)),
      this.minimapRadius
    );
    const direction = v2(positionX, positionY).normalize();
    if (isInInnerBoundingBox) {
      return {
        category: MinimapBoundingBoxCategory.RADIUS_1,
        positionY: direction.y * magnitude,
        positionX: direction.x * magnitude,
      };
    }
    if (isInOuterBoundingBox) {
      return {
        category: MinimapBoundingBoxCategory.RADIUS_2,
        positionX: direction.x * magnitude,
        positionY: direction.y * magnitude,
      };
    }
    return {
      category: MinimapBoundingBoxCategory.OUTSIDE,
      positionX: direction.x * magnitude,
      positionY: direction.y * magnitude,
    };
  }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */

import { SpritePool } from "./../pool/spritePool";
import { GameConfiguration } from "./../gameConfiguration";
import { _decorator, Component, Node, Sprite, v2, misc, UITransform } from "cc";
import { PlayerManager } from "../playerManager";
import { checkExist } from "../../lib/util/checkExist";
import {
  MinimapIndicatorClass,
  TBoundingData,
  TMinimapIndicator,
  TMinimapIndicatorPosition,
} from "../../interface/minimap";
import { MinimapBoundingBoxCategory } from "../../enum/minimap";
import { PLAYER_MANAGER_EVENT } from "../../enum/playerManager";
import { calculateAngleBetweenTwoDots } from "../../lib/util/algorithm";
import { BaseSprite } from "../../lib/sprite/baseSprite";
import { MinimapEnemySprite } from "../../sprite/minimapEnemySprite";
import { PlayerInstance } from "../../interface/player";
import { Minimap } from "./minimap";
const { ccclass, property } = _decorator;

@ccclass("MinimapPlayerIndicator")
export class MinimapPlayerIndicator
  extends Component
  implements MinimapIndicatorClass
{
  @property(PlayerManager)
  playerManager?: PlayerManager;
  @property(SpritePool)
  indicatorPool?: SpritePool;
  @property(Minimap)
  minimap?: Minimap;

  minimapIndicatorMap: Map<string, TMinimapIndicator> = new Map();

  start() {
    this.playerManager?.node.on(
      PLAYER_MANAGER_EVENT.PLAYER_INSTANCE_UPDATE,
      this.updateIndicator,
      this
    );
    this.playerManager?.node.on(
      PLAYER_MANAGER_EVENT.PLAYER_INSTANCE_DESTROY,
      this.onPlayerDestroy,
      this
    );
  }

  onPlayerDestroy(player: PlayerInstance) {
    this.removeFromMinimap(player.state.id);
  }

  updateIndicator(playerInstance: PlayerInstance) {
    const playerManager = checkExist(this.playerManager);
    const minimap = checkExist(this.minimap);
    if (playerManager.isMainPlayer(playerInstance.state)) return;
    const playerId = playerInstance.state.id;
    const boundingBoxData = minimap.checkEnemyBoundingBoxCategory(
      playerInstance.object.getHead()
    );
    if (!boundingBoxData) return;
    // if still not exist
    if (
      !this.minimapIndicatorMap.get(playerId) &&
      boundingBoxData.category !== MinimapBoundingBoxCategory.OUTSIDE
    ) {
      this.initIndicator(playerId, boundingBoxData);
      return;
    }
    // alreadyExist
    this.updatePlayerInMinimap(playerId, boundingBoxData);
  }

  initIndicator(playerId: string, boundingData: TBoundingData) {
    const indicatorPool = checkExist(this.indicatorPool);
    const spriteNode = indicatorPool.getSprite();
    if (!spriteNode || !boundingData) return;
    this.setEnemySpriteBasedOnCategory(spriteNode, boundingData.category);
    spriteNode.setParent(this.node);
    this.minimapIndicatorMap.set(playerId, {
      object: spriteNode,
      category: boundingData.category,
    });
    this.setupPLayerInMinimap(playerId, spriteNode, boundingData);
  }

  removeFromMinimap(playerId: string) {
    const playerInMinimap = this.minimapIndicatorMap.get(playerId);
    if (!playerInMinimap) return;
    this.indicatorPool?.returnSprite(playerInMinimap.object);
    this.minimapIndicatorMap.delete(playerId);
  }

  updatePlayerInMinimap(playerId: string, boundingData: TBoundingData) {
    const playerInMinimap = this.minimapIndicatorMap.get(playerId);
    if (!boundingData || !playerInMinimap) return;
    // check if should change icon and re init instead
    if (boundingData?.category === MinimapBoundingBoxCategory.OUTSIDE) {
      // return back the player
      this.removeFromMinimap(playerId);
      return;
    }
    if (playerInMinimap.category !== boundingData.category) {
      this.setEnemySpriteBasedOnCategory(
        playerInMinimap.object,
        boundingData.category
      );
      playerInMinimap.category = boundingData.category;
    }
    this.setupPLayerInMinimap(playerId, playerInMinimap.object, boundingData);
  }

  setEnemySpriteBasedOnCategory(
    node: Node,
    category: typeof MinimapBoundingBoxCategory[keyof typeof MinimapBoundingBoxCategory]
  ) {
    const baseSprite = checkExist(node.getComponent(MinimapEnemySprite));
    if (category === MinimapBoundingBoxCategory.RADIUS_1) {
      baseSprite.swapSpriteTo("near");
    } else {
      baseSprite.swapSpriteTo("far");
    }
  }

  copyRotationFromPlayer(playerId: string) {
    const playerInMinimap = this.minimapIndicatorMap.get(playerId);
    const player = this.playerManager?.getPlayerInstanceByID(playerId);
    const playerHead = player?.object.getHead();
    if (!player || !playerHead) return;
    playerInMinimap?.object.setRotation(playerHead.rotation);
  }

  setupPLayerInMinimap(
    playerId: string,
    spriteNode: Node,
    boundingData: TBoundingData
  ) {
    if (!boundingData) return;
    this.copyRotationFromPlayer(playerId);
    spriteNode.setPosition(boundingData.positionX, boundingData.positionY, 1);
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

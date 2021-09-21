import { Voucher } from "./../voucher";
import { SpritePool } from "./../pool/spritePool";
import { GameConfiguration } from "./../gameConfiguration";
import {
  _decorator,
  Component,
  Node,
  Sprite,
  v2,
  misc,
  UITransform,
  Vec3,
} from "cc";
import { PlayerManager } from "../playerManager";
import { checkExist } from "../../lib/util/checkExist";
import {
  MinimapIndicatorClass,
  TBoundingData,
  TMinimapIndicator,
} from "../../interface/minimap";
import { MinimapBoundingBoxCategory } from "../../enum/minimap";
import { Minimap } from "./minimap";
import { FoodManager } from "../foodManager";
import { FOOD_MANAGER_EVENT } from "../../enum/foodManager";
import { FoodInstance } from "../../interface/food";
import { SOCKET_FOOD_TYPE } from "../../lib/enum/socket";
import { MinimapVoucherIndicatorSprite } from "../../sprite/minimapVoucherIndicatorSprite";
import { PLAYER_MANAGER_EVENT } from "../../enum/playerManager";
import { PlayerInstance } from "../../interface/player";
import { calculateAngleBetweenTwoDots } from "../../lib/util/algorithm";
const { ccclass, property } = _decorator;

@ccclass("MinimapVoucherIndicator")
export class MinimapVoucherIndicator
  extends Component
  implements MinimapIndicatorClass
{
  @property(FoodManager)
  foodManager?: FoodManager;
  @property(PlayerManager)
  playerManager?: PlayerManager;
  @property(SpritePool)
  indicatorPool?: SpritePool;
  @property(Minimap)
  minimap?: Minimap;

  minimapIndicatorMap: Map<number, TMinimapIndicator> = new Map();

  start() {
    this.foodManager?.node.on(
      FOOD_MANAGER_EVENT.FOOD_INSTANCE_UPDATE,
      this.updateIndicator,
      this
    );
    // also update voucher indicator when main player move
    this.playerManager?.node.on(
      PLAYER_MANAGER_EVENT.PLAYER_INSTANCE_UPDATE,
      this.onMainPlayerMove,
      this
    );
    this.foodManager?.node.on(
      FOOD_MANAGER_EVENT.FOOD_INSTANCE_DESTROY,
      this.onFoodDestroy,
      this
    );
  }

  onFoodDestroy(food: FoodInstance) {
    this.removeFromMinimap(food.state.id);
  }

  onMainPlayerMove(playerInstance: PlayerInstance) {
    const playerManager = checkExist(this.playerManager);
    if (!playerManager.isMainPlayer(playerInstance.state)) return;
    this.foodManager?.getFoodsMap().forEach((food) => {
      if (food.state.type === SOCKET_FOOD_TYPE.VOUCHER) {
        this.updateIndicator(food);
      }
    });
  }

  updateIndicator(foodInstance: FoodInstance) {
    if (foodInstance.state.type !== SOCKET_FOOD_TYPE.VOUCHER) return;
    const minimap = checkExist(this.minimap);
    const foodId = foodInstance.state.id;
    const voucher = foodInstance.object as Voucher;
    const boundingBoxData = minimap.checkEnemyBoundingBoxCategory(voucher.node);
    if (!boundingBoxData) return;
    // if still not exist
    if (
      !this.minimapIndicatorMap.get(foodId) &&
      boundingBoxData.category !== MinimapBoundingBoxCategory.OUTSIDE
    ) {
      this.initIndicator(foodId, boundingBoxData);
      return;
    }
    // alreadyExist
    this.updateVoucherInMinimap(foodId, boundingBoxData);
  }

  initIndicator(foodId: number, boundingData: TBoundingData) {
    const indicatorPool = checkExist(this.indicatorPool);
    const spriteNode = indicatorPool.getSprite();
    if (!spriteNode || !boundingData) return;
    this.setVoucherSpriteBaseOnCategory(spriteNode, boundingData.category);
    spriteNode.setParent(this.node);
    this.minimapIndicatorMap.set(foodId, {
      object: spriteNode,
      category: boundingData.category,
    });
    this.setupVoucherInMinimap(foodId, spriteNode, boundingData);
  }

  removeFromMinimap(foodId: number) {
    const playerInMinimap = this.minimapIndicatorMap.get(foodId);
    if (!playerInMinimap) return;
    this.indicatorPool?.returnSprite(playerInMinimap.object);
    this.minimapIndicatorMap.delete(foodId);
  }

  updateVoucherInMinimap(foodId: number, boundingData: TBoundingData) {
    const voucherInMinimap = this.minimapIndicatorMap.get(foodId);
    if (!boundingData || !voucherInMinimap) return;
    // check if should change icon and re init instead
    if (boundingData?.category === MinimapBoundingBoxCategory.OUTSIDE) {
      // return back the player
      this.removeFromMinimap(foodId);
      return;
    }
    if (voucherInMinimap.category !== boundingData.category) {
      this.setVoucherSpriteBaseOnCategory(
        voucherInMinimap.object,
        boundingData.category
      );
      voucherInMinimap.category = boundingData.category;
    }
    this.setupVoucherInMinimap(foodId, voucherInMinimap.object, boundingData);
  }

  setVoucherSpriteBaseOnCategory(
    node: Node,
    category: typeof MinimapBoundingBoxCategory[keyof typeof MinimapBoundingBoxCategory]
  ) {
    const baseSprite = checkExist(
      node.getComponent(MinimapVoucherIndicatorSprite)
    );
    if (category === MinimapBoundingBoxCategory.RADIUS_1) {
      baseSprite.swapSpriteTo("near");
    } else {
      baseSprite.swapSpriteTo("far");
    }
  }

  setupVoucherInMinimap(
    foodId: number,
    spriteNode: Node,
    boundingData: TBoundingData
  ) {
    if (!boundingData) return;
    spriteNode.setPosition(boundingData.positionX, boundingData.positionY, 1);
    this.setVoucherIndicatorRotation(foodId);
  }

  setVoucherIndicatorRotation(foodId: number) {
    const voucherIndicator = this.minimapIndicatorMap.get(foodId);
    if (!voucherIndicator) return;
    const voucherNode = voucherIndicator.object;

    const angle = calculateAngleBetweenTwoDots(
      0,
      0,
      voucherNode.position.x,
      voucherNode.position.y
    );
    const deg = misc.radiansToDegrees(angle);
    voucherNode.setRotationFromEuler(0, 0, deg + 135);
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

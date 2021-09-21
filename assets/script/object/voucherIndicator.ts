import {
  _decorator,
  Component,
  tween,
  Vec3,
  UIOpacity,
  Node,
  Tween,
} from "cc";
import { ROOM_MANAGER_EVENT } from "../enum/roomManager";
import { SOCKET_FOOD_TYPE } from "../lib/enum/socket";
import { EatenFoodData } from "../lib/interface/socket";
import { BaseLabel } from "../lib/text/baseLabel";
import { calculateAngleBetweenTwoDots } from "../lib/util/algorithm";
import { PlayerArrowSprite } from "../sprite/playerArrowSprite";
import { RoomManager } from "./roomManager";
const { ccclass, property } = _decorator;

@ccclass("VoucherIndicator")
export class VoucherIndicator extends Component {
  @property(BaseLabel)
  public readonly voucherIndicatorText?: BaseLabel;

  @property(PlayerArrowSprite)
  public readonly playerArrowSprite?: PlayerArrowSprite;

  @property(RoomManager)
  public readonly roomManager?: RoomManager;

  private accumulateVouchers: number = 0;
  private currentActiveVoucherPointNode?: Node;

  onLoad() {
    this.setupListener();
  }

  private reset() {
    const { voucherIndicatorText } = this;

    if (!voucherIndicatorText) return;

    const { node } = voucherIndicatorText;

    Tween.stopAllByTarget(node);
    const uiOpacity = node.getComponent(UIOpacity);
    if (uiOpacity) {
      Tween.stopAllByTarget(uiOpacity);
      uiOpacity.opacity = 255;
    }
    node.active = false;
  }

  private getPointNode() {
    return this.voucherIndicatorText?.node;
  }
  
  private onFoodEaten(data: EatenFoodData, isMainPlayer: boolean, _points: number, type: SOCKET_FOOD_TYPE) {
    if (isMainPlayer && type === SOCKET_FOOD_TYPE.VOUCHER) {
      this.eatScoreAnimation(1);
    }
  }

  private setCurrentActiveVoucherPointNode(pointNode: Node | undefined) {
    this.currentActiveVoucherPointNode = pointNode;
  }

  private eatScoreAnimation(points: number) {
    const { playerArrowSprite } = this;
    const arrowPosition = playerArrowSprite?.node.position;
    const pointNode = this.getPointNode();

    if (pointNode && arrowPosition) {
      const pointText = pointNode.getComponent(BaseLabel);
      const radian = calculateAngleBetweenTwoDots(arrowPosition.x, arrowPosition.y, 0, 0);
      if (this.currentActiveVoucherPointNode) {
        // Hide current showing points so there wouldn't be a lot of stacking
        this.reset();
        this.setCurrentActiveVoucherPointNode(pointNode);
        this.accumulateVouchers += points;
      } else {
        this.setCurrentActiveVoucherPointNode(pointNode);
        this.accumulateVouchers = points;
      }
      let offset = 0;
      if (
        Math.abs(radian) >= (4 * Math.PI) / 5 &&
        Math.abs(radian) <= Math.PI
      ) {
        offset = 1;
      }
      const { x: x0, y: y0 } = this.translateByRadian(
        arrowPosition.x,
        arrowPosition.y + 20,
        Math.PI * offset,
        50
      );
      const { x, y } = this.translateByRadian(x0, y0, radian, -10);

      if (pointText) {
        pointText.setText(`+${this.accumulateVouchers} Voucher!`);
      }

      pointNode.active = true;
      pointNode.setPosition(new Vec3(x0, y0, 0));

      tween(pointNode)
        .to(
          0.3,
          {
            position: new Vec3(x, y, 0),
          },
          {
            easing: "sineInOut",
          }
        )
        .call(() => this.fadeout(pointNode))
        .union()
        .start();
    }
  }

  private setupListener() {
    this.roomManager?.node.on(ROOM_MANAGER_EVENT.EAT, this.onFoodEaten, this);
  }

  private translateByRadian(
    x0: number,
    y0: number,
    radian: number,
    distance: number
  ) {
    const x = x0 + distance * Math.cos(radian);
    const y = y0 + distance * Math.sin(radian);

    return { x, y };
  }

  private fadeout(node: Node) {
    const uiOpacity = node.getComponent(UIOpacity);
    tween(uiOpacity)
      .to(0.3, {
        opacity: 0,
      })
      .call(() => this.reset())
      .call(() => this.setCurrentActiveVoucherPointNode(undefined))
      .start();
  }
}

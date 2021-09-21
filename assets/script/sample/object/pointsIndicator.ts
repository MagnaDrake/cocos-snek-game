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

@ccclass("PointsIndicator")
export class PointsIndicator extends Component {
  @property(BaseLabel)
  public readonly pointsIndicatorText?: BaseLabel;

  @property(PlayerArrowSprite)
  public readonly playerArrowSprite?: PlayerArrowSprite;

  @property(RoomManager)
  public readonly roomManager?: RoomManager;

  private accumulatePoints: number = 0;
  private currentActivePointNode?: Node;

  onLoad() {
    this.setupListener();
  }

  private reset() {
    const { pointsIndicatorText } = this;

    if (!pointsIndicatorText) return;

    const { node } = pointsIndicatorText;

    Tween.stopAllByTarget(node);
    const uiOpacity = node.getComponent(UIOpacity);
    if (uiOpacity) {
      Tween.stopAllByTarget(uiOpacity);
      uiOpacity.opacity = 255;
    }
    node.active = false;
  }

  private getPointNode() {
    return this.pointsIndicatorText?.node;
  }
  
  private onFoodEaten(data: EatenFoodData, isMainPlayer: boolean, points: number, type: SOCKET_FOOD_TYPE) {
    if (isMainPlayer && type === SOCKET_FOOD_TYPE.BASIC) {
      this.eatScoreAnimation(points);
    }
  }

  private setCurrentActivePointNode(pointNode: Node | undefined) {
    this.currentActivePointNode = pointNode;
  }

  private eatScoreAnimation(points: number) {
    const { playerArrowSprite } = this;
    const arrowPosition = playerArrowSprite?.node.position;
    const pointNode = this.getPointNode();

    if (pointNode && arrowPosition) {
      const pointText = pointNode.getComponent(BaseLabel);
      const radian = calculateAngleBetweenTwoDots(arrowPosition.x, arrowPosition.y, 0, 0);
      if (this.currentActivePointNode) {
        // Hide current showing points so there wouldn't be a lot of stacking
        this.reset();
        this.setCurrentActivePointNode(pointNode);
        this.accumulatePoints += points;
      } else {
        this.setCurrentActivePointNode(pointNode);
        this.accumulatePoints = points;
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
        arrowPosition.y,
        Math.PI * offset,
        20
      );
      const { x, y } = this.translateByRadian(x0, y0, radian, -20);

      if (pointText) {
        pointText.setText(`+${this.accumulatePoints}`);
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
      .call(() => this.setCurrentActivePointNode(undefined))
      .start();
  }
}

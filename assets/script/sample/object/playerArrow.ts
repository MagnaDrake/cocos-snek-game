import { _decorator, Component, Vec2, misc } from "cc";
import { GameControl } from "../control/gameControl";
import { GAME_CONTROL_EVENT } from "../enum/gameControl";
import { PLAYER_MANAGER_EVENT } from "../enum/playerManager";
import { BaseSprite } from "../lib/sprite/baseSprite";
import { calculateAngleBetweenTwoDots } from "../lib/util/algorithm";
import { PlayerManager } from "./playerManager";
const { ccclass, property } = _decorator;

@ccclass("PlayerArrow")
export class PlayerArrow extends Component {
  @property(BaseSprite)
  public readonly playerArrowSprite?: BaseSprite;

  @property(GameControl)
  public readonly gameControl?: GameControl;

  @property(PlayerManager)
  public readonly playerManager?: PlayerManager;

  start() {
    this.setupListeners();
  }

  private onJoystickMove(direction: Vec2, magnitude: number) {
    const { playerArrowSprite } = this;
    const angle = calculateAngleBetweenTwoDots(direction.x, direction.y, 0, 0);
    const deg = misc.radiansToDegrees(angle);
    playerArrowSprite?.node.setRotationFromEuler(0, 0, deg + 90);
    playerArrowSprite?.node.setPosition(direction.x * 40, direction.y * 40);
  }

  private onPlayerInstanceCreate() {
    const { playerArrowSprite, playerManager } = this;
    const mainPlayer = playerManager?.getMainPlayerInstance();
    if (mainPlayer) {
      const radian = calculateAngleBetweenTwoDots(
        mainPlayer.state.velocity.x,
        mainPlayer.state.velocity.y,
        0,
        0,
      );
      const deg = misc.radiansToDegrees(radian);
      const { x, y } = this.translateByRadian(0, 0, radian, 40);
      playerArrowSprite?.node.setRotationFromEuler(0, 0, deg + 90);
      playerArrowSprite?.node.setPosition(x, y);
    }
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

  private setupListeners() {
    this.gameControl?.node.on(
      GAME_CONTROL_EVENT.JOYSTICK_MOVE,
      this.onJoystickMove,
      this
    );

    this.playerManager?.node.on(
      PLAYER_MANAGER_EVENT.PLAYER_INSTANCE_CREATE,
      this.onPlayerInstanceCreate,
      this
    );
  }
}

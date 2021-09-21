import { GameConfiguration } from "./gameConfiguration";
import { _decorator, Component, v2, Vec2, misc, UIOpacity } from "cc";
import { JOYSTICK_EVENT } from "../enum/joystick";
import { JoystickBaseSprite } from "../sprite/joystickBaseSprite";
import { JoystickButtonSprite } from "../sprite/joystickButtonSprite";
import { getOrientationBetweenVector } from "../lib/util/algorithm";
const { ccclass, property } = _decorator;

@ccclass("Joystick")
export class Joystick extends Component {
  private readonly DIRECTION_UPDATE_INCREMENT = misc.degreesToRadians(10);

  @property(JoystickBaseSprite)
  public readonly joystickBaseSprite?: JoystickBaseSprite;

  @property(JoystickButtonSprite)
  public readonly joystickButtonSprite?: JoystickButtonSprite;

  @property(GameConfiguration)
  public readonly gameConfiguration?: GameConfiguration;

  /**
   * Radius of the joystick's circle (to prevent joystickButton from going out of the circle)
   */
  private readonly radius = 40;

  /**
   * Radius of the joystick's ring (in order for a move to be registered, joystickButton has to move past this ring)
   */
  private readonly ringRadius = 23;

  private uiOpacity?: UIOpacity | null;

  private currentDirection?: Vec2;

  private targetDirection?: Vec2;

  onLoad() {
    this.uiOpacity = this.getComponent(UIOpacity);
  }

  getTurnSensitivity() {
    const gameConfiguration = this.getGameConfiguration();
    return gameConfiguration.getCombinedConfiguration().turn_sensitivity;
  }

  private getGameConfiguration() {
    if (!this.gameConfiguration) {
      throw new Error("GameConfiguration not exist on Joystick");
    }
    return this.gameConfiguration;
  }

  private show() {
    const { uiOpacity } = this;
    if (uiOpacity) {
      uiOpacity.opacity = 255;
    }
  }

  private hide() {
    const { uiOpacity } = this;
    if (uiOpacity) {
      uiOpacity.opacity = 0;
    }
  }

  public spawnAt(x: number, y: number) {
    this.show();
    this.node.setPosition(x, y);
    this.joystickButtonSprite?.node.setPosition(0, 0);
  }

  public despawn() {
    this.hide();
  }

  public moveButtonTo(x: number, y: number) {
    const { radius, ringRadius } = this;
    const displacementX = x - this.node.position.x;
    const displacementY = y - this.node.position.y;

    const magnitude = Math.min(
      Math.sqrt(Math.pow(displacementX, 2.0) + Math.pow(displacementY, 2.0)),
      radius
    );
    const direction = v2(displacementX, displacementY).normalize();

    this.joystickButtonSprite?.node.setPosition(
      direction.x * magnitude,
      direction.y * magnitude
    );

    /**
     * In order for a move to be emitted, joystickButton has to move past the joystickRing
     */
    if (magnitude < ringRadius) return;

    this.setTargetDirection(direction.x, direction.y);
  }

  public setCurrentDirection(x: number, y: number) {
    if (this.currentDirection) {
      this.currentDirection.set(x, y);
    } else {
      this.currentDirection = v2(x, y);
    }
  }

  public setTargetDirection(x: number, y: number) {
    if (this.targetDirection) {
      this.targetDirection.set(x, y);
    } else {
      this.targetDirection = v2(x, y);
    }
  }

  private interpolateCurrentToTargetDirection() {
    const { currentDirection, targetDirection, DIRECTION_UPDATE_INCREMENT } =
      this;

    if (!currentDirection || !targetDirection) return;

    const orientation = getOrientationBetweenVector(
      currentDirection,
      targetDirection
    );
    const angle = Vec2.angle(currentDirection, targetDirection);
    const turningAngle =
      Math.min(angle, DIRECTION_UPDATE_INCREMENT * this.getTurnSensitivity()) *
      orientation;
    currentDirection.rotate(turningAngle);

    this.node.emit(JOYSTICK_EVENT.MOVE, currentDirection);
  }

  update() {
    this.interpolateCurrentToTargetDirection();
  }
}

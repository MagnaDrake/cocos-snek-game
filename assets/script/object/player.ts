import { _decorator, Component, Node, UIOpacity, tween, lerp, misc, Tween, Vec2, v2 } from "cc";
import { GameplayCamera } from "../camera/GameplayCamera";
import { PLAYER_EVENT } from "../enum/player";
import { PlayerState } from "../lib/interface/socket";
import { calculateAngleBetweenTwoDots } from "../lib/util/algorithm";
import { SpritePool } from "./pool/spritePool";
import { ClientPrediction } from "./prediction/clientPrediction";
const { ccclass, property } = _decorator;

// TO-DO: death animation, smoothing
@ccclass("Player")
export class Player extends Component {
  private readonly BLINK_DURATION = 0.75;

  private readonly LERP_COEFFICIENT = 0.33;

  private readonly SERVER_LERP_COEFFICIENT = 0.20;

  private readonly ROTATION_OFFSET = 90;

  @property(SpritePool)
  public readonly bigChickenRedPool?: SpritePool;

  @property(SpritePool)
  public readonly bigChickenBluePool?: SpritePool;

  @property(SpritePool)
  public readonly smallChickYellowPool?: SpritePool;

  @property(SpritePool)
  public readonly smallChickBluePool?: SpritePool;

  @property(GameplayCamera)
  public readonly gameplayCamera?: GameplayCamera;

  @property(ClientPrediction)
  public readonly clientPrediction?: ClientPrediction;

  private uiOpacity?: UIOpacity | null;

  private sprites = new Array<Node>();

  /**
   * State contains positions and other necessary data received from the websocket.
   */
  private state?: PlayerState;

  /**
   * ProcessState contains positions and other necessary data used for positioning player's sprites.
   * It is taken from state, and interpolated with prediction when necessary.
   */
  private processState?: PlayerState;

  private blinkTween?: Tween<UIOpacity>;

  /**
   * LastPatch refers to the last time the player's positions were updated (timestamp in ms)
   */
  private lastPatch = Date.now();

  private isMainPlayer = false;

  private initializeComponents() {
    this.uiOpacity = this.getComponent(UIOpacity);
  }

  onLoad() {
    this.initializeComponents();
  }

  private updateLastPatch() {
    this.lastPatch = Date.now();
  }

  /**
   * Difference in time from the last state update in ms.
   * @returns 
   */
  private getDeltaFromLastPatch() {
    return Date.now() - this.lastPatch;
  }

  private setState(state: PlayerState) {
    this.state = state;
    this.node.emit(PLAYER_EVENT.STATE_UPDATE, state);
  }

  /**
   * Syncs processState with state from webSocket.
   * 
   * TO-DO: refactor this
   */
  private syncProcessState() {
    /**
     * If process state is undefined, replace immediately
     */
    if (!this.processState) {
      this.processState = this.state;
      return;
    }

    const { state, processState, SERVER_LERP_COEFFICIENT } = this;
    if (state && processState) {
      /**
       * Otherwise, lerp the processState to match current state
       */
      state.body.parts.forEach((part, i) => {
        const processPart = processState.body.parts[i];
        
        if (!processPart) {
          processState.body.parts.push(part);
          return;
        }

        processPart.x = lerp(processPart.x, part.x, SERVER_LERP_COEFFICIENT);
        processPart.y = lerp(processPart.y, part.y, SERVER_LERP_COEFFICIENT);
      });

      processState.velocity.x = lerp(processState.velocity.x, state.velocity.x, SERVER_LERP_COEFFICIENT);
      processState.velocity.y = lerp(processState.velocity.y, state.velocity.y, SERVER_LERP_COEFFICIENT);

      /**
       * Update reference to ensure that prediction can override state
       */
      state.body.parts = processState.body.parts;
    }
  }

  private setMainPlayer(isMainPlayer: boolean) {
    this.isMainPlayer = isMainPlayer;
  }

  onStateCreate(state: PlayerState, isMainPlayer: boolean) {
    // TO-DO: spawn sprites
    const { body } = state;
    const { parts } = body;

    parts.forEach((val, index) => {
      const isHead = index === 0;
      const { x, y } = val;

      const sprite = this.spawnChickSprite(isHead, isMainPlayer);
      this.addChickSprite(sprite);
      sprite?.setPosition(x, y);
    });  

    this.setState(state);
    this.setMainPlayer(isMainPlayer);
  }

  onStateUpdate(state: PlayerState) {
    const { isMainPlayer } = this;
    const { body, invulnerable } = state;
    const { parts } = body;

    if (this.sprites.length < parts.length) {
      const sprite = this.spawnChickSprite(false, isMainPlayer);
      this.addChickSprite(sprite);

      const { x, y } = parts[parts.length - 1];
      sprite?.setPosition(x, y);
    }

    this.setState(state);
    this.updateBlinkTween(invulnerable);
  }

  onStateDestroy(state: PlayerState) {
    const { isMainPlayer } = this;

    this.sprites.forEach((sprite) => {
      const isHead = sprite === this.getHead();
      this.returnChickSprite(sprite, isHead, isMainPlayer);
    });
    this.node.destroy();
  }

  public getHead() {
    return this.sprites[0] || this.node;
  }

  private getSpritePool(isHead: boolean, isMainPlayer: boolean) {
    if (isMainPlayer) {
      if (isHead) {
        return this.bigChickenRedPool;
      }
      return this.smallChickYellowPool;
    } else {
      if (isHead) {
        return this.bigChickenBluePool;
      }
      return this.smallChickBluePool;
    }
  }

  private spawnChickSprite(isHead: boolean, isMainPlayer: boolean) {  
    return this.getSpritePool(isHead, isMainPlayer)?.getSprite();
  }

  private returnChickSprite(sprite: Node, isHead: boolean, isMainPlayer: boolean) {
    this.getSpritePool(isHead, isMainPlayer)?.returnSprite(sprite);
  }

  private addChickSprite(sprite?: Node) {
    if (!sprite) return;

    sprite.active = false;
    this.node.insertChild(sprite, 0);
    this.sprites.push(sprite);
  }

  private updateBlinkTween(isInvulnerable: boolean) {
    if (isInvulnerable) {
      this.startBlinkTween();
    } else {
      this.stopBlinkTween();
    }
  }

  private startBlinkTween() {
    const { uiOpacity, blinkTween, BLINK_DURATION } = this;

    if (!uiOpacity || blinkTween) return;

    this.blinkTween = tween(uiOpacity)
      .to(
        BLINK_DURATION * 0.5,
        { opacity: 0 }
      )
      .to(
        BLINK_DURATION * 0.5,
        { opacity: 255 }
      )
      .union()
      .repeatForever()
      .start();
  }

  private stopBlinkTween() {
    this.blinkTween?.stop();
    this.blinkTween = undefined;

    const { uiOpacity } = this;
    if (uiOpacity) {
      uiOpacity.opacity = 255;
    }
  }

  private lerpSpritePosition(sprite: Node, index: number) {
    const { processState, LERP_COEFFICIENT } = this;

    if (!processState) return;

    const { parts } = processState.body;
    const part = parts[index];

    if (!part) return;

    const { x, y } = part;

    /**
     * Use Math.round(x) and Math.round(y) to imitate server response as much as possible
     */
    this.lerpBodyPartPosition(sprite, Math.round(x), Math.round(y), LERP_COEFFICIENT);
  }

  private lerpBodyPartPosition(part: Node, targetX: number, targetY: number, lerpCoefficient: number) {
    const { x, y } = part.position;
    const lerpPositionX = lerp(x, targetX, lerpCoefficient);
    const lerpPositionY = lerp(y, targetY, lerpCoefficient);

    part.setPosition(lerpPositionX, lerpPositionY);
  }

  private lerpSpriteRotation(prevSprite: Node | undefined, sprite: Node) {
    const { processState, LERP_COEFFICIENT, ROTATION_OFFSET } = this;

    if (!processState) return;

    if (prevSprite) {
      const angle = calculateAngleBetweenTwoDots(
        prevSprite.position.x,
        prevSprite.position.y,
        sprite.position.x,
        sprite.position.y,
      );
      const deg = misc.radiansToDegrees(angle);
      this.lerpBodyPartRotation(sprite, deg + ROTATION_OFFSET, LERP_COEFFICIENT);
    } else {
      const { x, y } = processState.velocity;
      const angle = calculateAngleBetweenTwoDots(x, y, 0, 0);
      const deg = misc.radiansToDegrees(angle);
      this.lerpBodyPartRotation(sprite, deg + ROTATION_OFFSET, LERP_COEFFICIENT);
    }

    return sprite;
  }

  private lerpBodyPartRotation(part: Node, targetZ: number, lerpCoefficient: number) {
    let { z } = part.eulerAngles;
    
    /**
     * To prevent sharp turns
     */
    const diffZ = targetZ - z;
    if (diffZ < -180) {
      z -= 360;
    } else if (diffZ > 180) {
      z += 360;
    }

    const lerpRotationZ = lerp(z, targetZ, lerpCoefficient);
    part.setRotationFromEuler(0, 0, lerpRotationZ);
  }

  private lerpBodyParts() {
    this.updateProcessState();
    this.sprites.forEach(this.lerpSpritePosition, this);
    this.sprites.reduce(this.lerpSpriteRotation.bind(this), undefined);
  }

  private updateSpriteVisibility(sprite: Node) {
    const { gameplayCamera } = this;

    if (gameplayCamera?.isNodeVisibleInCamera(sprite)) {
        sprite.active = true;
    } else {
        sprite.active = false;
    }
  }

  private updateBodyPartsVisibility() {
    this.sprites.forEach(this.updateSpriteVisibility, this);
  }

  private updateProcessState() {
    if (this.processState) {
      this.clientPrediction?.patchStateWithPrediction(this.processState, this.getDeltaFromLastPatch());
    }
    this.syncProcessState();
    this.updateLastPatch();
  }

  update() {
    this.lerpBodyParts();
    this.updateBodyPartsVisibility();
  }
}
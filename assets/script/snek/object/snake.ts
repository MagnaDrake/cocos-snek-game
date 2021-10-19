import {
  _decorator,
  Component,
  Node,
  instantiate,
  v2,
  macro,
  math,
  Vec2,
  Vec3,
  v3,
  tween,
  Color,
} from "cc";
import { SNAKE_BODY_PART, SNAKE_EVENT } from "../enum/snake";
import {
  ISnakeConfig,
  ISnakePart,
  ISnakeUpdateIntervalConfig,
} from "../interface/ISnake";
import { SnakeSprite } from "../sprite/snakeSprite";
const { ccclass, property } = _decorator;

@ccclass("Snake")
export class Snake extends Component {
  private readonly baseColor = Color.WHITE;

  private readonly glowColor = new Color(255, 255, 160);

  @property(SnakeSprite)
  public readonly snakeSprite?: SnakeSprite;

  private updateInterval = 1.0;

  private speedMultiplier = 1.0;

  private speedUpThreshold = 1;

  private minimumInterval = 1.0;

  private eatCounter = 0;

  public bodyParts = new Array<ISnakePart>();

  private foodBodyParts = new Array<ISnakePart>();

  private movementDirection = v2(0, 0);

  start() {
    // [3]
  }

  public initialize(config: ISnakeConfig) {
    this.setupInterval(config.interval);

    const head = this.getHead();
    const neck = this.getNeck();

    if (!head || !neck) return;

    //const { x, y } = this.getDirectionBetweenParts(neck, head);
    // this.movementDirection.set(x, y);
    this.adjustTextures();
  }

  public adjustTextures() {
    this.bodyParts.reduce((previousPart, part) => {
      this.adjustPartTexture(previousPart, part);
      return part;
    }, undefined as unknown as ISnakePart);
  }

  public adjustPartTexture(previousPart: ISnakePart, part: ISnakePart) {
    const { sprite } = part;
    if (previousPart) {
      // const { x, y } = this.getDirectionBetweenParts(part, previousPart);

      const isTail = part === this.getTail();
      if (isTail) {
        sprite.adjustTexture(SNAKE_BODY_PART.TAIL);
      } else {
        sprite.adjustTexture(SNAKE_BODY_PART.BODY);
      }

      // this.setPartDirection(part, x, y);
    } else {
      const { x, y } = this.movementDirection;

      sprite.adjustTexture(SNAKE_BODY_PART.HEAD);

      // this.setPartDirection(part, x, y);
    }
  }

  public addPart(colIndex: number, rowIndex: number, x: number, y: number) {
    const { snakeSprite } = this;

    if (!snakeSprite) return undefined;

    const sprite = instantiate(snakeSprite.node);
    sprite.setParent(this.node);
    sprite.setPosition(x, y);
    sprite.active = true;

    const part = {
      sprite: sprite.getComponent(SnakeSprite),
      index: v2(colIndex, rowIndex),
      position: v3(x, y, 0),
      rotation: v3(0, 0, 0),
    } as ISnakePart;

    this.bodyParts.push(part);

    return part;
  }

  public getHead() {
    return this.bodyParts[0];
  }

  public getTail() {
    return this.bodyParts[this.bodyParts.length - 1];
  }

  public getNeck() {
    return this.bodyParts[1];
  }

  private setupInterval(config: ISnakeUpdateIntervalConfig) {
    const { initial, accelerateMultiplier, accelerateEvery, minimum } = config;

    this.updateInterval = initial;
    this.speedMultiplier = accelerateMultiplier;
    this.speedUpThreshold = accelerateEvery;
    this.minimumInterval = minimum;
  }

  // update (deltaTime: number) {
  //     // [4]
  // }
}
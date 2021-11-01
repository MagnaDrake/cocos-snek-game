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

  private foodProcessingParts = new Array<ISnakePart>();

  private movementDirection = v2(0, 0);

  private hasPerformedMove = false;

  start() {
    // [3]
  }

  public initialize(config: ISnakeConfig) {
    this.setupInterval(config.interval);

    const head = this.getHead();
    const neck = this.getNeck();

    if (!head || !neck) return;

    const { x, y } = this.getDirectionBetweenParts(neck, head);
    this.movementDirection.set(x, y);
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
      const { x, y } = this.getDirectionBetweenParts(part, previousPart);

      const isTail = part === this.getTail();
      if (isTail) {
        sprite.adjustTexture(SNAKE_BODY_PART.TAIL);
      } else {
        sprite.adjustTexture(SNAKE_BODY_PART.BODY);
      }

      this.setPartOrientation(part, x, y);
    } else {
      const { x, y } = this.movementDirection;

      sprite.adjustTexture(SNAKE_BODY_PART.HEAD);

      this.setPartOrientation(part, x, y);
    }
  }

  private getDirectionBetweenParts(partA: ISnakePart, partB: ISnakePart) {
    return v2(partB.index.x - partA.index.x, partB.index.y - partA.index.y);
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

  public get Head() {
    return this.getHead();
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

  /**
   * Updates snake bodypart index and world position
   * @param part part to update
   * @param index new board index
   * @param pos new world position
   */
  private updatePartPosition(part: ISnakePart, index: Vec2, pos: Vec3) {
    const { x, y } = index;
    const { x: posX, y: posY } = pos;

    part.index.set(x, y);
    part.position.set(pos);
    tween(part.sprite.node)
      .to(
        this.updateInterval,
        {
          position: v3(posX, posY),
        },
        {
          onComplete: () => {
            if (part === this.Head) this.processFood();
          },
        }
      )
      .start();
  }

  public moveTo(index: Vec2, pos: Vec3) {
    this.moveHeadTo(index, pos);
  }

  private moveHeadTo(index: Vec2, pos: Vec3) {
    this.updateSnakeBodyPositions(this.Head, index, pos, 0);
    this.adjustTextures();
  }

  private updateSnakeBodyPositions(
    part: ISnakePart,
    index: Vec2,
    pos: Vec3,
    partOrder: number
  ) {
    if (!part || partOrder > this.bodyParts.length) return;

    // recursion update bodypart but seems like its dumb
    // todo try first then iterate
    // yup its dumb
    const nextPart = this.bodyParts[partOrder + 1];
    this.updateSnakeBodyPositions(
      nextPart,
      part.index,
      part.position,
      partOrder + 1
    );

    this.updatePartPosition(part, index, pos);
  }

  public startMoveTick() {
    this.updateMoveScheduler();
  }

  /**
   * emit move event and pass current direction heading
   */
  moveTick() {
    this.hasPerformedMove = true;
    this.node.emit(SNAKE_EVENT.MOVE, this.movementDirection);
  }

  updateMoveScheduler() {
    this.unschedule(this.moveTick);
    this.schedule(this.moveTick, this.updateInterval, macro.REPEAT_FOREVER);
  }

  public changeDirectionHeading(xDir: number, yDir: number) {
    this.movementDirection.set(xDir, yDir);
    this.hasPerformedMove = false;

    //todo check legal move
  }

  isPartChangingDirection(part: ISnakePart, dirX: number, dirY: number) {
    const { direction } = part;

    if (!direction) return true;

    if (direction.x === dirX && direction.y === dirY) return false;

    return true;
  }

  setPartOrientation(part: ISnakePart, dirX: number, dirY: number) {
    const { direction } = part;

    const shouldRotateOrientation = this.isPartChangingDirection(
      part,
      dirX,
      dirY
    );

    if (direction) {
      direction.set(dirX, dirY);
    } else {
      part.direction = v2(dirX, dirY);
    }

    if (shouldRotateOrientation) {
      this.adjustPartRotation(part);
    }
  }

  adjustPartRotation(part: ISnakePart) {
    const { direction, sprite } = part;

    if (!direction) return;

    const nextRotation = this.getPartAngleByDirection(direction.x, direction.y);
    const { rotation: currentRotation } = part || {};
    if (!nextRotation || !currentRotation) return;

    const { x, y, z } = nextRotation;

    const { z: currentZ } = currentRotation;

    /**
     * To prevent sharp turns
     */
    let diffZ = z - currentZ;
    if (diffZ < -180) {
      diffZ = (diffZ + 360) % 360;
    } else if (diffZ > 180) {
      diffZ = (diffZ - 360) % 360;
    }

    part.rotation?.set(x, y, z);

    sprite.node.setRotationFromEuler(x, y, z);
  }

  private getPartAngleByDirection(directionX: number, directionY: number) {
    if (directionY === -1) {
      return v3(0, 0, 0);
    } else if (directionX === 1) {
      return v3(0, 0, -90);
    } else if (directionY === 1) {
      return v3(0, 0, -180);
    } else if (directionX === -1) {
      return v3(0, 0, -270);
    }
  }

  public eatFruit() {
    this.animateProcessFood(this.Head);
  }

  processFood() {
    const nextParts = this.foodProcessingParts.reduce((res, part) => {
      const parts = this.bodyParts;
      const nextPart = parts[parts.indexOf(part) + 1];

      if (nextPart) {
        res.push(nextPart);
      }

      return res;
    }, new Array<ISnakePart>());

    this.foodProcessingParts = [];

    nextParts.forEach((part) => {
      this.animateProcessFood(part);

      if (part === this.getTail()) {
        //this.incrementEatCounter();
        //this.spawnNewTail();
      }
    });
  }

  animateProcessFood(part: ISnakePart) {
    const { glowColor, baseColor } = this;

    tween(part.sprite.node)
      .to(
        this.updateInterval * 0.5,
        {
          scale: v3(2, 1, 1),
        },
        {
          onStart() {
            part.sprite.setColor(glowColor);
          },
        }
      )
      .to(
        this.updateInterval * 0.5,
        {
          scale: v3(1, 1, 1),
        },
        {
          onComplete() {
            part.sprite.setColor(baseColor);
          },
        }
      )
      .start();
    this.foodProcessingParts.push(part);
  }

  // update (deltaTime: number) {
  //     // [4]
  // }
}

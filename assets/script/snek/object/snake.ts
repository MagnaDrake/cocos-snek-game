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
interface IFoodInfo {
  index: Vec2;
  position: Vec3;
}

@ccclass("Snake")
export class Snake extends Component {
  private readonly baseColor = Color.WHITE;

  private readonly glowColor = new Color(255, 255, 160);

  @property(SnakeSprite)
  public readonly snakeSprite?: SnakeSprite;

  private updateInterval = 1.0;

  private tweenInterval = 1.0;

  private speedMultiplier = 1.0;

  private speedUpThreshold = 1;

  private minimumInterval = 1.0;

  private eatCounter = 0;

  public bodyParts = new Array<ISnakePart>();

  private foodProcessingParts = new Array<ISnakePart>();

  private processingLocations = new Array<IFoodInfo>();

  private tailQueue = new Array<IFoodInfo>();

  private movementDirection = v2(0, 0);

  private hasPerformedMove = false;

  private tickCounter = 0;

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

  private getHead() {
    return this.bodyParts[0];
  }

  public get Head() {
    return this.getHead();
  }

  private getTail() {
    return this.bodyParts[this.bodyParts.length - 1];
  }

  public get Tail() {
    return this.getTail();
  }

  private getNeck() {
    return this.bodyParts[1];
  }

  public get Neck() {
    return this.getNeck();
  }

  private setupInterval(config: ISnakeUpdateIntervalConfig) {
    const { initial, accelerateMultiplier, accelerateEvery, minimum } = config;

    this.updateInterval = initial * 3; // assume 0.3, *3 = 0.9
    this.tweenInterval = this.updateInterval / 3; // return to 0.3
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

    tween(part.sprite.node)
      .to(
        this.tweenInterval,
        {
          position: v3(posX, posY),
        },
        {
          onComplete: () => {
            if (part.index.x === 0 && part.index.y === 0) {
              console.log("i am now at 0,0");
            }
            if (part === this.Head) {
              if (this.processingLocations) {
                const lastEatenFood = this.processingLocations.slice(-1)[0];
                if (
                  lastEatenFood &&
                  part.index.x === lastEatenFood.index.x &&
                  part.index.y === lastEatenFood.index.y
                ) {
                  this.animateProcessFood(part);
                }
              }
              this.processFood();
            }
            if (part === this.Tail && this.processingLocations) {
              const firstProcessedFood = this.processingLocations[0];
              console.log(
                firstProcessedFood?.index.x,
                firstProcessedFood?.index.y
              );
              console.log(part?.index.x, part?.index.y);

              // not entirely sure the set x,y doesnt evaluate correctly
              // apparently this is due to the scheduler ticking in sync with the tween
              // and somehow causing problems
              if (
                firstProcessedFood &&
                part.index.y === firstProcessedFood.index.y &&
                part.index.x === firstProcessedFood.index.x
              ) {
                this.tailQueue.push(
                  this.processingLocations.shift() as IFoodInfo
                );
              }
            }
          },
        }
      )
      .start();
    part.position.set(pos);
    part.index.set(x, y);
  }

  public moveTo(index: Vec2, pos: Vec3) {
    this.moveHeadTo(index, pos);
    console.log(this.tailQueue);
    if (this.tailQueue.length > 0) {
      this.spawnNewTail(this.tailQueue.shift() as IFoodInfo);
      this.incrementEatCounter();
    }
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
  public moveTick() {
    this.tickCounter += 1;
    this.hasPerformedMove = true;
    this.node.emit(SNAKE_EVENT.MOVE, this.movementDirection);
    console.log("movetick", this.tickCounter);
  }

  updateMoveScheduler() {
    this.unschedule(this.moveTick);
    this.schedule(this.moveTick, this.updateInterval, macro.REPEAT_FOREVER);
  }

  public changeDirectionHeading(xDir: number, yDir: number) {
    if (this.isLegalMove(xDir, yDir)) {
      this.movementDirection.set(xDir, yDir);
      this.hasPerformedMove = false;
      return true;
    } else {
      return false;
    }

    //todo check legal move
  }

  isPartChangingDirection(part: ISnakePart, dirX: number, dirY: number) {
    const { direction } = part;

    if (!direction) return true;

    if (direction.x === dirX && direction.y === dirY) return false;

    return true;
  }

  private isLegalMove(directionX: number, directionY: number) {
    const head = this.Head;
    const neck = this.Neck;

    if (!head || !neck) return true;

    return (
      !(
        head.index.x + directionX === neck.index.x &&
        head.index.y + directionY === neck.index.y
      ) &&
      !(
        this.movementDirection.x === directionX &&
        this.movementDirection.y === directionY
      )
    );
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

  public eatFruit(index: Vec2, position: Vec3) {
    const foodInfo: IFoodInfo = {
      index: v2(index),
      position: v3(position),
    };
    this.processingLocations.push(foodInfo);
    console.log("eat fruit");
    console.log(foodInfo.index);
    console.log(this.Head.index);
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

    console.log(this.bodyParts.indexOf(nextParts[0]));

    nextParts.forEach((part) => {
      this.animateProcessFood(part);
    });
  }

  animateProcessFood(part: ISnakePart) {
    const { glowColor, baseColor } = this;

    tween(part.sprite.node)
      .to(
        this.tweenInterval * 0.5,
        {
          scale: v3(2, 1, 1),
        },
        {
          onStart: () => {
            part.sprite.setColor(glowColor);
            this.foodProcessingParts.push(part);
          },
        }
      )
      .to(
        this.tweenInterval * 0.5,
        {
          scale: v3(1, 1, 1),
        },
        {
          onComplete: () => {
            part.sprite.setColor(baseColor);
          },
        }
      )
      .start();
  }

  spawnNewTail(foodInfo: IFoodInfo) {
    const currentTail = this.Tail;
    const { rotation, direction } = currentTail;
    const { index, position } = foodInfo;
    console.log("spawn tail on index ", index);
    if (!direction) return false;
    const part = this.addPart(index.x, index.y, position.x, position.y);
    part?.rotation.set(rotation);
    part?.sprite.node.setRotationFromEuler(rotation);
    part?.sprite.node.setScale(0, 0, 1);
    part?.sprite.adjustTexture(SNAKE_BODY_PART.TAIL);
    this.adjustTextures();

    tween(part?.sprite.node)
      .to(this.tweenInterval * 0.7, {
        scale: v3(1.25, 1, 1),
      })
      .to(this.tweenInterval * 0.3, {
        scale: v3(1, 1, 1),
      })
      .start();
  }

  public die() {
    this.unschedule(this.moveTick);
    console.log("mokad");
  }

  private incrementEatCounter() {
    this.eatCounter += 1;
    if (this.eatCounter % this.speedUpThreshold === 0) {
      this.updateInterval = Math.max(
        this.updateInterval * this.speedMultiplier,
        this.minimumInterval
      );
    }
    this.updateMoveScheduler();
  }

  // update (deltaTime: number) {
  //     // [4]
  // }
}

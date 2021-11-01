import { math } from "cc";
import { SnakeSprite } from "../sprite/snakeSprite";
/**
 * Snake bodypart interface
 * @param sprite sprite object of the snake bodypart
 * @param index row-col index of snake bodypart on game board
 * @param position x,y position on game world
 * @param rotation bodypart rotation angle
 * @param direction vector heading of bodypart on game board
 */
export interface ISnakePart {
  sprite: SnakeSprite;
  index: math.Vec2;
  position: math.Vec3;
  rotation: math.Vec3;
  direction?: math.Vec2;
}

export interface ISnakeConfig {
  parts: Array<{ x: number; y: number }>;
  interval: ISnakeUpdateIntervalConfig;
}

export interface ISnakeUpdateIntervalConfig {
  initial: number;
  accelerateMultiplier: number;
  accelerateEvery: number;
  minimum: number;
}

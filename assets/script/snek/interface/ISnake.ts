import { math } from "cc";
import { SnakeSprite } from "../sprite/snakeSprite";

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

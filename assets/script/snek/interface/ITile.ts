import { math, Node } from "cc";

export interface ITile {
  value: number;
  node?: Node;
  index: math.Vec2;
}

export interface ITileSprite {
  adjustTexture(isEven: boolean): any;
}

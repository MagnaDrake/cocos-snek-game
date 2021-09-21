import { MinimapBoundingBoxCategory } from "./../enum/minimap";
import { Component, Node, Sprite, Vec2 } from "cc";
import { SpritePool } from "../object/pool/spritePool";
import { Minimap } from "../object/minimap/minimap";

export type TMinimapIndicatorPosition = {
  x: number;
  y: number;
};

export type TMinimapIndicator = {
  object: Node;
  category: typeof MinimapBoundingBoxCategory[keyof typeof MinimapBoundingBoxCategory];
};

export type TBoundingData = {
  category: typeof MinimapBoundingBoxCategory[keyof typeof MinimapBoundingBoxCategory];
  positionX: number;
  positionY: number;
};

export interface MinimapIndicatorClass extends Component {
  indicatorPool?: SpritePool;
  minimap?: Minimap;
  minimapIndicatorMap: Map<any, TMinimapIndicator>;
  updateIndicator(...args: any): void;
  initIndicator(...args: any): void;
  removeFromMinimap(...args: any): void;
}

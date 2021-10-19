import { _decorator, Component, Node, instantiate, math, v2 } from "cc";
import { BaseSprite } from "../../lib/sprite/baseSprite";
import { getTileType, TILE_TYPE } from "../enum/tile";
import { ITile } from "../interface/ITile";
//import { AppleSprite } from "../sprite/appleSprite";
import { FloorSprite } from "../sprite/floorSprite";
import { WallSprite } from "../sprite/wallSprite";
// import { Snake } from './snake';
const { ccclass, property } = _decorator;

@ccclass("Board")
export class Board extends Component {
  @property(FloorSprite)
  public readonly tileSprite?: BaseSprite;

  @property(WallSprite)
  public readonly wallSprite?: BaseSprite;

  @property(Node)
  public readonly tileNode?: Node;
  /*
  @property(AppleSprite)
  public readonly appleSprite?: AppleSprite;
  */
  private readonly tileSize = 28;

  private board = new Array<Array<ITile>>();

  private fruits = new Array<{ node: Node; index: math.Vec2 }>();

  constructor() {
    super("Board");
  }
}

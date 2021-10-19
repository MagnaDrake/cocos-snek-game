import { _decorator, Component, Node, instantiate, math, v2 } from "cc";
import { BaseSprite } from "../../lib/sprite/baseSprite";
import { getTileType, TILE_TYPE } from "../enum/tile";
import { ITile, ITileSprite } from "../interface/ITile";
//import { AppleSprite } from "../sprite/appleSprite";
import { FloorSprite } from "../sprite/floorSprite";
import { WallSprite } from "../sprite/wallSprite";
// import { Snake } from './snake';
const { ccclass, property } = _decorator;

@ccclass("Board")
export class Board extends Component {
  @property(FloorSprite)
  public readonly floorSprite?: FloorSprite;

  @property(WallSprite)
  public readonly wallSprite?: WallSprite;

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

  public generateBoardFromLevelConfig(levelConfig: Array<Array<number>>) {
    this.board = this.getBoardFromLevelConfig(levelConfig);
  }

  private getBoardFromLevelConfig(levelConfig: Array<Array<number>>) {
    return levelConfig.map((row, rowIndex) => {
      return row.map((tile, colIndex) => {
        return {
          value: tile,
          index: v2(colIndex, rowIndex),
        } as ITile;
      });
    });
  }

  private getTile(colIndex: number, rowIndex: number) {
    const row = this.board[rowIndex];
    if (row) {
      return row[colIndex];
    }
    return undefined;
  }

  /*
  returns the sprite 'prefab' script assigned
  */
  private getTileSprite(tile: ITile) {
    const tileType = getTileType(tile.value);
    switch (tileType) {
      case TILE_TYPE.WALL: {
        return this.wallSprite;
      }

      default: {
        return this.floorSprite;
      }
    }
  }

  public getTilePosition(colIndex: number, rowIndex: number) {
    const { tileSize } = this;
    return {
      x: colIndex * tileSize,
      y: -rowIndex * tileSize,
    };
  }

  private assignNodeToTile(colIndex: number, rowIndex: number, node: Node) {
    const tile = this.getTile(colIndex, rowIndex);
    if (tile) {
      tile.node = node;
    }
  }

  public generateBoardSprites() {
    this.board.forEach((row, rowIndex) => {
      row.forEach((tile, colIndex) => {
        const tileSprite = this.getTileSprite(tile);
        if (tileSprite) {
          const { x, y } = this.getTilePosition(colIndex, rowIndex);
          const tile = instantiate(tileSprite);
          tile.node.setParent(this.tileNode || this.node);
          tile.node.setPosition(x, y);
          tile.node.active = true;

          tile.adjustTexture((colIndex + rowIndex) % 2 === 0);

          this.assignNodeToTile(colIndex, rowIndex, tile.node);
        }
      });
    });
  }
}

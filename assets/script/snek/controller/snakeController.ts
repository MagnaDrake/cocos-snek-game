import {
  _decorator,
  Component,
  Node,
  systemEvent,
  SystemEvent,
  Vec2,
  Vec3,
  v2,
  tiledLayerAssembler,
} from "cc";
import { Board } from "../object/board";
import { Snake } from "../object/snake";
const { ccclass, property } = _decorator;

@ccclass("SnakeController")
export class SnakeController extends Component {
  @property(Board)
  public readonly board?: Board;

  @property(Snake)
  public readonly snake?: Snake;

  start() {
    this.setupControllerEvents();
  }

  setupControllerEvents() {
    console.log("setup controller");
    systemEvent.on(SystemEvent.EventType.TOUCH_END, (event) => {
      const worldPos = event.getLocation();
      const boardIndex = this.board?.getTileIndexFromWorldPosition(worldPos);
      console.log(boardIndex, worldPos);
      const boardIndexVector = new Vec2(boardIndex?.col, boardIndex?.row);
      const worldPosVec3 = new Vec3(worldPos.x, worldPos.y);
      console.log(boardIndexVector, worldPosVec3);
      this.snake?.moveTo(
        new Vec2(boardIndex?.col, boardIndex?.row),
        new Vec3(worldPos.x, worldPos.y, 0)
      );
    });

    systemEvent.on(SystemEvent.EventType.KEY_DOWN, (event) => {
      switch (event.keyCode) {
        case 37: {
          //left
          this.moveSnake(-1, 0);
          break;
        }

        case 38: {
          //up
          this.moveSnake(0, -1);
          break;
        }

        case 39: {
          //right
          this.moveSnake(1, 0);
          break;
        }

        case 40: {
          //down
          this.moveSnake(0, 1);
          break;
        }

        default: {
          break;
        }
      }
    });
  }

  moveSnake(xDir: number, yDir: number) {
    if (!this.snake || !this.board) return;

    const { x, y } = this.snake.Head.index;
    const nextIdx = v2(x + xDir, y + yDir);
    const nextTile = this.board.getTileFromIndex(nextIdx.x, nextIdx.y);

    if (nextTile && nextTile.node) {
      this.snake.moveTo(nextIdx, nextTile.node.position);
    }
  }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */

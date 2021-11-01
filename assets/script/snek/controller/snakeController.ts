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
import { SNAKE_BODY_PART, SNAKE_EVENT } from "../enum/snake";

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

  startSnakeMovement() {
    this.setupSnakeListeners();
    this.snake?.moveTick(); //initial tick
    this.snake?.startMoveTick();
  }

  setupControllerEvents() {
    systemEvent.on(SystemEvent.EventType.KEY_DOWN, (event) => {
      switch (event.keyCode) {
        case 37: {
          //left
          this.changeSnakeDirection(-1, 0);
          break;
        }

        case 38: {
          //up
          this.changeSnakeDirection(0, -1);
          break;
        }

        case 39: {
          //right
          this.changeSnakeDirection(1, 0);
          break;
        }

        case 40: {
          //down
          this.changeSnakeDirection(0, 1);
          break;
        }

        default: {
          break;
        }
      }
    });
  }

  setupSnakeListeners() {
    const { snake, board } = this;

    if (!snake || !board) return;

    snake.node.on(SNAKE_EVENT.MOVE, this.moveSnake, this);
  }

  moveSnake(direction: Vec2) {
    if (!this.snake || !this.board) return;

    const { x, y } = this.snake.Head.index;
    const nextIdx = v2(x + direction.x, y + direction.y);
    const nextTile = this.board.getTileFromIndex(nextIdx.x, nextIdx.y);

    // not entirely sure why process food needs to be checked on this part of the code
    // if not it breaks
    // this.snake.processFood();

    const fruitNode = this.board.checkFruit(nextIdx.x, nextIdx.y);

    if (fruitNode) {
      this.snakeEatFruit(fruitNode);
      this.board.spawnFruit(this.snake);
    }

    if (nextTile && nextTile.node) {
      this.snake.moveTo(nextIdx, nextTile.node.position);
    }
  }

  changeSnakeDirection(x: number, y: number) {
    const isDirectionChanged = this.snake?.changeDirectionHeading(x, y);

    if (isDirectionChanged) {
    }

    this.node.emit("yeet", x, y);
  }

  snakeEatFruit(fruit: { node: Node; index: Vec2 }) {
    this.snake?.eatFruit();
    this.board?.removeFruit(fruit);
  }
}

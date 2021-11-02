import { _decorator, Component, Node } from "cc";
import { getLevelConfig } from "../config/level";
import { SnakeController } from "../controller/snakeController";
import { SCENE_KEY } from "../enum/scene";
import { IBoardConfig } from "../interface/IBoard";
import { ISnakeConfig } from "../interface/ISnake";

import { Board } from "../object/board";
import { Snake } from "../object/snake";
import { TransitionScreen } from "../sprite/transitionScreen";
const { ccclass, property } = _decorator;

@ccclass("GameScene")
export class GameScene extends Component {
  // [1]
  // dummy = '';

  // [2]
  // @property
  // serializableDummy = 0;

  @property(Board)
  public readonly board?: Board;

  @property(Snake)
  public readonly snake?: Snake;

  @property(SnakeController)
  public readonly snakeController?: SnakeController;

  start() {
    const { boardConfig, snakeConfig } = getLevelConfig();
    this.generateBoard(boardConfig);
    this.generateSnake(snakeConfig);

    this.snakeController?.node.once("yeet", () => {
      this.startGame();
      this.generateFruit();
    });

    this.snake?.bodyParts.forEach((part) => {
      console.log(part.index, part.position);
    });
  }

  startGame() {
    this.snakeController?.startSnakeMovement();
  }

  private generateBoard(config: IBoardConfig) {
    const { tiles } = config;

    this.board?.generateBoardFromLevelConfig(tiles);
    this.board?.generateBoardSprites();
  }

  private generateSnake(config: ISnakeConfig) {
    const { board, snake } = this;

    if (!board || !snake) return;

    const { parts } = config;
    parts.forEach((part) => {
      const { x, y } = part;
      const { x: posX, y: posY } = board.getTilePosition(x, y);
      snake.addPart(x, y, posX, posY);
    });
    snake.initialize(config);
  }

  private generateFruit() {
    if (this.snake) {
      this.board?.spawnFruit(this.snake);
    }
  }

  // update (deltaTime: number) {
  //     // [4]
  // }
}

import { _decorator, Component, Node } from "cc";
import { getLevelConfig } from "../config/level";
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

  start() {
    const { boardConfig, snakeConfig } = getLevelConfig();
    this.generateBoard(boardConfig);
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
    parts.forEach((val) => {
      const { x, y } = val;
      const { x: posX, y: posY } = board.getTilePosition(x, y);
      snake.addPart(x, y, posX, posY);
    });
    snake.initialize(config);
  }

  // update (deltaTime: number) {
  //     // [4]
  // }
}

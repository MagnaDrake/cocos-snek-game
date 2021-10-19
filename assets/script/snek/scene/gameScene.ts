import { _decorator, Component, Node } from "cc";
import { getLevelConfig } from "../config/level";
import { SCENE_KEY } from "../enum/scene";
import { IBoardConfig } from "../interface/IBoard";
import { Board } from "../object/board";
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

  start() {
    const { boardConfig, snakeConfig } = getLevelConfig();
    this.generateBoard(boardConfig);
  }

  private generateBoard(config: IBoardConfig) {
    const { tiles } = config;

    this.board?.generateBoardFromLevelConfig(tiles);
    this.board?.generateBoardSprites();
  }

  // update (deltaTime: number) {
  //     // [4]
  // }
}

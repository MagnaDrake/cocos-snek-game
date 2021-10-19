import { IBoardConfig } from "./IBoard";
import { ISnakeConfig } from "./ISnake";

export interface ILevelConfig {
  boardConfig: IBoardConfig;
  snakeConfig: ISnakeConfig;
}

import { TLocalGameConfiguration } from "../interface/gameConfig";

export enum GAME_CONFIGURATION_EVENT {
  FETCH_SUCCESS = "fetch_sucess",
  FETCH_FAIL = "fetch_fail",
  UPDATE_SUCCESS = "update_sucess",
  UPDATE_FAIL = "update_fail",
}

export enum GAME_CONFIGURATION_TYPE {
  LOCAL = "local",
  SERVER = "server",
}

export const DEFAULT_LOCAL_GAME_CONFIG: TLocalGameConfiguration = {};

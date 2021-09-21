import { GAME_CONFIGURATION_TYPE } from "./../enum/gameConfiguration";
import { TGameConfiguration, TLocalGameConfiguration } from "./gameConfig";

type TLocalParams = {
  type: GAME_CONFIGURATION_TYPE.LOCAL;
  config: TLocalGameConfiguration;
};

type TServerParams = {
  type: GAME_CONFIGURATION_TYPE.SERVER;
  config: TGameConfiguration;
};
export type TSettingsChangedParam = TLocalParams | TServerParams;

export type TSettingsItemChangedParam = {
  value: number;
  key: string;
};

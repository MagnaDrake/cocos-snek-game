import { TGameConfigurationKeys } from "./../interface/gameConfig";
import { _decorator, Component, Node } from "cc";
import {
  DEFAULT_LOCAL_GAME_CONFIG,
  GAME_CONFIGURATION_EVENT,
} from "../enum/gameConfiguration";
import {
  TGameConfiguration,
  TLocalGameConfiguration,
} from "../interface/gameConfig";
import {
  getLocalConfigurationFromLocalStorage,
  updateLocalStorageLocalConfiguration,
} from "../lib/util/localStorage";
import {
  getGameConfiguration,
  setGameConfiguration,
} from "../service/gameConfigurationService";
const { ccclass, property } = _decorator;

@ccclass("GameConfiguration")
export class GameConfiguration extends Component {
  private gameConfiguration?: TGameConfiguration;

  onLoad() {
    if (!this.getLocalConfiguration()) {
      updateLocalStorageLocalConfiguration(DEFAULT_LOCAL_GAME_CONFIG);
    }
  }

  async fetch() {
    return getGameConfiguration()
      .then(this.onFetchSuccess.bind(this))
      .catch(this.onFetchFail.bind(this));
  }

  async updateConfig(key: TGameConfigurationKeys, value: number) {
    const currentConfig = this.getConfiguration();

    if (!currentConfig) {
      throw new Error("updateConfig failed, currentConfig is undefined");
    }

    const configParam = {
      ...currentConfig,
      [key]: value,
    };
    return setGameConfiguration(this.mapConfigurationScale(configParam, true))
      .then(this.onUpdateSuccess.bind(this))
      .catch(this.onUpdateFail.bind(this));
  }

  private onFetchSuccess(config: TGameConfiguration) {
    this.setConfiguration(this.mapConfigurationScale(config));
    this.node?.emit(GAME_CONFIGURATION_EVENT.FETCH_SUCCESS, config);
  }

  private onFetchFail() {
    this.node?.emit(GAME_CONFIGURATION_EVENT.FETCH_FAIL);
  }

  private onUpdateSuccess() {
    this.fetch();
    this.node.emit(GAME_CONFIGURATION_EVENT.UPDATE_SUCCESS);
  }

  private onUpdateFail() {
    this.node.emit(GAME_CONFIGURATION_EVENT.UPDATE_FAIL);
  }

  private setConfiguration(config: TGameConfiguration) {
    this.gameConfiguration = config;
  }

  private mapConfigurationScale(
    config: TGameConfiguration,
    reverse: boolean = false
  ) {
    // reverse used when sending back config to be
    if (reverse) {
      config.food_respawn_delay = config.food_respawn_delay * 1000;

      return config;
    }
    config.food_respawn_delay = config.food_respawn_delay / 1000;

    return config;
  }

  setLocalConfiguration(config: TLocalGameConfiguration) {
    updateLocalStorageLocalConfiguration(config);
  }

  getLocalConfiguration(): TLocalGameConfiguration {
    return getLocalConfigurationFromLocalStorage();
  }

  getConfiguration() {
    return this.gameConfiguration;
  }

  // TO-DO: check if ! is needed
  getCombinedConfiguration() {
    const localConfig = this.getLocalConfiguration();
    return {
      ...localConfig,
      ...this.getConfiguration()!,
    };
  }
}

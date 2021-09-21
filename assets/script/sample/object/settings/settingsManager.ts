import { GAME_CONFIGURATION_EVENT } from "./../../enum/gameConfiguration";
import { _decorator, Component, Button } from "cc";
import { GAME_CONFIGURATION_TYPE } from "../../enum/gameConfiguration";
import { SETTINGS_EVENT } from "../../enum/settings";
import {
  TCombinedGameConfigurationKeys,
  TGameConfigurationKeys,
  TLocalGameConfigurationKeys,
} from "../../interface/gameConfig";
import { TSettingsChangedParam } from "../../interface/settings";
import { Toast } from "../../lib/toast/Toast";
import { debounceCocos } from "../../lib/util/debounceCocos";
import { GameConfiguration } from "../gameConfiguration";
import { SettingsUI } from "./settingsUI";
import { checkExist } from "../../lib/util/checkExist";
const { ccclass, property } = _decorator;

@ccclass("SettingsManager")
export class SettingsManager extends Component {
  @property(SettingsUI)
  settingsUI?: SettingsUI;

  @property(Button)
  settingsButton?: Button;

  @property(GameConfiguration)
  gameConfiguration?: GameConfiguration;

  private localConfigKeys: TLocalGameConfigurationKeys[] = [];
  private serverConfigKeys: TGameConfigurationKeys[] = [
    "food_respawn_delay",
    "height",
    "food_eaten_per_chicken",
    "player_velocity",
    "max_food_amount_inside_room",
    "play_time",
    "max_player_per_room",
    "max_room",
    "player_to_foods_conversion_rate",
    "points_amount_per_chicken",
    "points_per_food",
    "width",
    "voucher_respawn_delay",
    "vouchers_per_room",
    "camera_zoom",
    "turn_sensitivity",
  ];

  onLoad() {
    this.setConfig = debounceCocos(this, this.setConfig, 0.5);
    const gameConfiguration = checkExist(
      this.gameConfiguration,
      "game configuration not exist on settings manager on load"
    );
    gameConfiguration.node.on(
      GAME_CONFIGURATION_EVENT.FETCH_FAIL,
      this.onFetchFail,
      this
    );
    gameConfiguration.node.on(
      GAME_CONFIGURATION_EVENT.FETCH_SUCCESS,
      this.onFetchSuccess,
      this
    );
    gameConfiguration.node.on(
      GAME_CONFIGURATION_EVENT.UPDATE_FAIL,
      this.onFetchFail,
      this
    );
  }

  start() {
    this.loadServerConfig();
  }

  private onFetchFail() {
    Toast.show("Mohon Maaf. Server Sedang Sibuk");
  }

  private onFetchSuccess() {
    this.node.emit(SETTINGS_EVENT.FETCH_SETTINGS);
  }

  private loadServerConfig() {
    if (!this.gameConfiguration) {
      throw new Error(
        "Game Configuration not found on settings manager component"
      );
    }
    this.gameConfiguration.fetch();
  }

  closeSettings() {
    if (!this.settingsUI) return;
    this.settingsUI.closeSettings();
    this.node.emit(SETTINGS_EVENT.CLOSE_SETTINGS);
  }

  openSettings() {
    if (!this.settingsUI) return;
    this.settingsUI.openSettings();
    this.node.emit(SETTINGS_EVENT.OPEN_SETTINGS);
  }

  setConfig(key: TCombinedGameConfigurationKeys, value: number) {
    if (!this.isValidLocalConfigKey(key) && !this.isValidServerConfigKey(key)) {
      throw new Error(
        `the component used ${key} as config but not found in local / server config`
      );
    }
    if (this.localConfigKeys.includes(key as TLocalGameConfigurationKeys)) {
      this.handleSetLocalConfig(key as TLocalGameConfigurationKeys, value);
      return;
    }
    this.handleSetServerConfig(key as TGameConfigurationKeys, value);
  }

  private isValidLocalConfigKey(key: TCombinedGameConfigurationKeys) {
    return this.localConfigKeys.includes(key as TLocalGameConfigurationKeys);
  }

  private isValidServerConfigKey(key: TCombinedGameConfigurationKeys) {
    return this.serverConfigKeys.includes(key as TGameConfigurationKeys);
  }

  private handleSetLocalConfig(
    key: TLocalGameConfigurationKeys,
    value: number
  ) {
    if (!this.gameConfiguration) {
      throw new Error("GameConfiguration not found when setLocalConfig");
    }
    const currentConfig = this.gameConfiguration.getLocalConfiguration();

    const updatedConfig = {
      ...currentConfig,
      [key]: value,
    };

    this.gameConfiguration.setLocalConfiguration(updatedConfig);

    const param: TSettingsChangedParam = {
      type: GAME_CONFIGURATION_TYPE.LOCAL,
      config: updatedConfig,
    };

    this.node.emit(SETTINGS_EVENT.CHANGED_SETTINGS, param);
  }

  private handleSetServerConfig(key: TGameConfigurationKeys, value: number) {
    const gameConfiguration = checkExist(
      this.gameConfiguration,
      "game configuration not exist on handleSetServerConfig"
    );
    gameConfiguration.updateConfig(key, value);
  }
}

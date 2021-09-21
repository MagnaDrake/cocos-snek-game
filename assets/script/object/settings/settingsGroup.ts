import { SettingsItem } from "./settingsItem";
import { _decorator, Component } from "cc";
import { SettingsManager } from "./settingsManager";
import { TSettingsItemChangedParam } from "../../interface/settings";
import { TCombinedGameConfigurationKeys } from "../../interface/gameConfig";
import { SETTINGS_EVENT, SETTINGS_ITEM_EVENT } from "../../enum/settings";
import { GameConfiguration } from "../gameConfiguration";
import { checkExist } from "../../lib/util/checkExist";
const { ccclass, property } = _decorator;

@ccclass("SettingsGroup")
export class SettingsGroup extends Component {
  @property(SettingsManager)
  settingsManager?: SettingsManager;

  @property(GameConfiguration)
  gameConfiguration?: GameConfiguration;

  childSettingsItems?: SettingsItem[];

  onLoad() {
    this.childSettingsItems = this.getComponentsInChildren(SettingsItem);
    const settingsManager = checkExist(
      this.settingsManager,
      "settingsManager not exist on SettingsGroup"
    );
    settingsManager.node.on(
      SETTINGS_EVENT.FETCH_SETTINGS,
      this.onFetchSetting,
      this
    );
    this.childSettingsItems.forEach((settingsItem) => {
      settingsItem.node.on(
        SETTINGS_ITEM_EVENT.VALUE_CHANGED,
        this.onSettingItemChanged,
        this
      );
    });
  }

  start() {
    this.reloadSettingItemsValue();
  }

  private onFetchSetting() {
    this.reloadSettingItemsValue();
  }

  reloadSettingItemsValue() {
    if (!this.childSettingsItems) {
      throw new Error("SettingsItem not found inside SettingsGroup");
    }
    if (!this.gameConfiguration) {
      throw new Error("GameConfiguration not found inside SettingsGroup");
    }
    const currentConfig = this.gameConfiguration.getCombinedConfiguration();
    this.childSettingsItems.forEach((settingsItem) => {
      const value =
        currentConfig[settingsItem.keyName as TCombinedGameConfigurationKeys];
      settingsItem.setEditBoxValue(value);
      settingsItem.setSliderProgress(value);
    });
  }

  onSettingItemChanged(param: TSettingsItemChangedParam) {
    if (!this.settingsManager) {
      throw new Error("Settings Manager not found on onSettingItemChanged");
    }
    this.settingsManager.setConfig(
      param.key as TCombinedGameConfigurationKeys,
      param.value
    );
  }
}

import { _decorator, Component, Node } from "cc";
import { ButtonClickSfx } from "../audio/buttonClickSfx";
import { SETTINGS_EVENT } from "../enum/settings";
import { BaseButton } from "../lib/button/baseButton";
import { BUTTON_EVENT } from "../lib/enum/button";
import { SettingsManager } from "../object/settings/settingsManager";
const { ccclass, property } = _decorator;

@ccclass("QuestionButton")
export class QuestionButton extends BaseButton {
  @property(ButtonClickSfx)
  public readonly soundEffect?: ButtonClickSfx;

  @property(SettingsManager)
  settingsManager?: SettingsManager;

  start() {
    super.start();

    this.node.on(BUTTON_EVENT.TOUCH_END, this.handleButtonTap, this);
  }

  private handleButtonTap() {
    this.soundEffect?.playOneShot();
    this.settingsManager?.openSettings();
  }
}

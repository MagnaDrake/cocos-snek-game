import { _decorator, Component, Node } from "cc";
import { ButtonClickSfx } from "../../audio/buttonClickSfx";
import { SETTINGS_EVENT } from "../../enum/settings";
import { BaseButton } from "../../lib/button/baseButton";
import { BUTTON_EVENT } from "../../lib/enum/button";
import { SettingsManager } from "./settingsManager";
const { ccclass, property } = _decorator;

@ccclass("SettingsButton")
export class SettingsButton extends BaseButton {
  @property(SettingsManager)
  settingsManager?: SettingsManager;

  @property(ButtonClickSfx)
  public readonly soundEffect?: ButtonClickSfx;

  onLoad() {
    this.node.on(BUTTON_EVENT.TOUCH_END, this.onClose, this);
  }

  onClose() {
    this.soundEffect?.playOneShot();
    this.settingsManager?.closeSettings();
  }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */

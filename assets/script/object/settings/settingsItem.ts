import { EDIT_BOX_EVENT } from "./../../lib/enum/editBox";
import { _decorator, Component, CCFloat, CCString } from "cc";
import { BaseEditBox } from "../../lib/editBox/baseEditBox";
import { BaseSlider } from "../../lib/slider/baseSlider";
import { SLIDER_EVENT } from "../../lib/enum/slider";
import { SETTINGS_ITEM_EVENT } from "../../enum/settings";
import { TSettingsItemChangedParam } from "../../interface/settings";
const { ccclass, property } = _decorator;

@ccclass("SettingsItem")
export class SettingsItem extends Component {
  @property(BaseEditBox)
  settingEditBox?: BaseEditBox;

  @property(BaseSlider)
  settingSlider?: BaseSlider;

  @property(CCFloat)
  value: number = 50;

  @property(CCFloat)
  minValue: number = 0;

  @property(CCFloat)
  maxValue: number = 100;

  @property(CCFloat)
  step: number = 0;

  @property(CCString)
  keyName: string = "";

  onLoad() {
    this.setEditBoxValue();
    this.setSliderProgress();
  }

  start() {
    // [3]
    this.settingEditBox?.node.on(
      EDIT_BOX_EVENT.CHANGED_TEXT,
      this.onEditBoxChanged,
      this
    );

    this.settingSlider?.node.on(SLIDER_EVENT.SLIDE, this.onSlide, this);
  }

  onEditBoxChanged(baseEditBox: BaseEditBox) {
    let value = Number(baseEditBox.string);
    if (value < this.minValue) {
      baseEditBox.string = String(this.minValue);
      value = this.minValue;
    }
    if (value > this.maxValue) {
      baseEditBox.string = String(this.maxValue);
      value = this.maxValue;
    }
    this.value = this.getClampedValue(value);
    this.setSliderProgress();
    const settingsItemChangedParam: TSettingsItemChangedParam = {
      value: this.value,
      key: this.keyName,
    };
    this.node.emit(SETTINGS_ITEM_EVENT.VALUE_CHANGED, settingsItemChangedParam);
  }

  onSlide(slider: BaseSlider) {
    this.value = this.getClampedValue(slider.progress * this.maxValue);
    this.setEditBoxValue();
    const settingsItemChangedParam: TSettingsItemChangedParam = {
      value: this.value,
      key: this.keyName,
    };
    this.node.emit(SETTINGS_ITEM_EVENT.VALUE_CHANGED, settingsItemChangedParam);
  }

  getClampedValue(value: number) {
    // use step 0 for decimal progress like 0.1 so it doesn't get clamped
    if (this.step === 0) {
      return value;
    }
    const valueToStepMod = value % this.step;
    if (valueToStepMod === 0) {
      return value;
    }
    // clamp downward
    if (valueToStepMod < this.step / 2) {
      return value - valueToStepMod;
    }
    // clamp upward
    if (valueToStepMod >= this.step / 2) {
      return value - valueToStepMod + this.step;
    }
    return value;
  }

  setEditBoxValue(value: number = this.value) {
    if (!this.settingEditBox) {
      throw new Error(`Setting editbox inexist on ${this.keyName}`);
    }
    this.settingEditBox.string = String(value);
  }

  setSliderProgress(value: number = this.value) {
    if (!this.settingSlider) {
      throw new Error(`Setting settingSlider inexist on ${this.keyName}`);
    }
    this.settingSlider.progress = value / this.maxValue;
  }
}
import { _decorator, Component, Node } from 'cc';
import { ButtonClickSfx } from '../audio/buttonClickSfx';
import { BaseButton } from '../lib/button/baseButton';
import { BUTTON_EVENT } from '../lib/enum/button';
import { getSoundStateFromLocalStorage, updateLocalStorageSoundState } from '../lib/util/localStorage';
import { SoundButtonSprite } from '../sprite/soundButtonSprite';
const { ccclass, property } = _decorator;

@ccclass('SoundToggleButton')
export class SoundToggleButton extends BaseButton {
  @property(SoundButtonSprite)
  public readonly soundButtonSprite?: SoundButtonSprite;

  @property(ButtonClickSfx)
  public readonly soundEffect?: ButtonClickSfx;

  start () {
    super.start();

    this.syncButtonSprite();

    this.node.on(BUTTON_EVENT.TOUCH_END, this.toggleSoundState, this);
  }

  /**
   * Toggle sound (audio) on/off for entire game audio related.
   * @param shouldOn Value for toggling sound manually, set `true` to turn it on (`false` to turn off)
   * or leave it empty to automatically toggle from the previous state.
   */
    public toggleSoundState (shouldOn?: boolean) {
      const currentSoundState = getSoundStateFromLocalStorage();
      updateLocalStorageSoundState(shouldOn || !currentSoundState);
      this.syncButtonSprite();
      this.soundEffect?.playOneShot();
    }

    /**
     * Synchronize current sound/audio state with the button texture
     */
    private syncButtonSprite () {
      const isSoundStateOn = getSoundStateFromLocalStorage();
      this.soundButtonSprite?.setButtonSprite(isSoundStateOn);
    }
}

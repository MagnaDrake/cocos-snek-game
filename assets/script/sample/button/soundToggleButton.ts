import { _decorator, Node, Button } from 'cc';
import { getSoundStateFromLocalStorage, updateLocalStorageSoundState } from '../../lib/util/localStorage';
import { SoundButtonSprite } from '../sprite/soundButtonSprite';
const { ccclass, property } = _decorator;

@ccclass('SoundToggleButton')
export class SoundToggleButton extends Button {
  @property(SoundButtonSprite)
  public readonly soundButtonSprite?: SoundButtonSprite;

  start () {
    this.syncButtonSprite();

    this.node.on(Node.EventType.TOUCH_END, () => {
      this.toggleSoundState();
    }, this);
  }

  /**
   * Toggle sound (audio) on/off for entire game audio related.
   * @param shouldOn Value for toggling sound manually, set `true` to turn it on (`false` to turn off)
   * or leave it empty to automatically toggle from the previous state.
   */
    public toggleSoundState(shouldOn?: boolean) {
      const currentSoundState = getSoundStateFromLocalStorage();
      updateLocalStorageSoundState(shouldOn || !currentSoundState);
      this.syncButtonSprite();
    }

    /**
     * Synchronize current sound/audio state with the button texture
     */
    private syncButtonSprite() {
      const isSoundStateOn = getSoundStateFromLocalStorage();
      this.soundButtonSprite?.setButtonSprite(isSoundStateOn);
    }
}

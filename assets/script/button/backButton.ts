import { _decorator, Component, Node } from 'cc';
import { ButtonClickSfx } from '../audio/buttonClickSfx';
import { BaseButton } from '../lib/button/baseButton';
import { BUTTON_EVENT } from '../lib/enum/button';
import { RoomManager } from '../object/roomManager';
const { ccclass, property } = _decorator;

@ccclass('BackButton')
export class BackButton extends BaseButton {
  @property(ButtonClickSfx)
  public readonly soundEffect?: ButtonClickSfx;

  @property(RoomManager)
  public readonly roomManager?: RoomManager;

  start () {
    super.start();

    this.node.on(BUTTON_EVENT.TOUCH_END, this.onButtonTap, this);
  }

  private onButtonTap () {
    this.soundEffect?.playOneShot();
    this.roomManager?.leaveRoom();
  }
}
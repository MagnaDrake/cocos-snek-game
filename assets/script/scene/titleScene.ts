import { _decorator, Component, director, find } from "cc";
import { BackgroundMusic } from "../audio/backgroundMusic";
import { PLAY_BUTTON_GROUP_EVENT } from "../enum/playButtonGroup";
import { SCENE_KEY } from "../enum/scene";
import { Toast } from "../lib/toast/Toast";
import {
  getUsernameFromLocalStorage,
  updateLocalStorageUsername,
} from "../lib/util/localStorage";
import ShopeeWebBridge from "../lib/webBridge/shopeeWebBridge";
import { PlayButtonGroup } from "../object/playButtonGroup";
const { ccclass, property } = _decorator;

@ccclass("TitleScene")
export class TitleScene extends Component {
  @property(PlayButtonGroup)
  public readonly playButtonGroup?: PlayButtonGroup;

  onLoad () {
    ShopeeWebBridge.configurePage({
      title: 'Shopee Chicks',
      showNavbar: true,
    });
  }

  start() {
    this.playButtonGroup?.setUsername(getUsernameFromLocalStorage());

    this.playButtonGroup?.node.on(
      PLAY_BUTTON_GROUP_EVENT.PLAY_BUTTON_CLICK,
      this.onStartPlay,
      this
    );
  }

  private onStartPlay(username: string) {
    // If success
    this.playButtonGroup?.node.off(
      PLAY_BUTTON_GROUP_EVENT.PLAY_BUTTON_CLICK,
      this.onStartPlay,
      this
    );
    updateLocalStorageUsername(username);
    this.goToGameScene();
  }

  private goToGameScene() {
    director.loadScene(SCENE_KEY.GAME);
  }
}

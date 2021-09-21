import { _decorator, Component, director } from "cc";
import { SCENE_KEY } from "../enum/scene";
import { Toast } from "../../lib/toast/Toast";
import {
  getUsernameFromLocalStorage,
  updateLocalStorageUsername,
} from "../../lib/util/localStorage";
import ShopeeWebBridge from "../../lib/webBridge/shopeeWebBridge";
const { ccclass, property } = _decorator;

@ccclass("TitleScene")
export class TitleScene extends Component {
  onLoad () {
    ShopeeWebBridge.configurePage({
      title: 'Shopee Chicks',
      showNavbar: true,
    });
  }

  start() {

  }

  private onStartPlay(username: string) {
    updateLocalStorageUsername(username);
  }
}

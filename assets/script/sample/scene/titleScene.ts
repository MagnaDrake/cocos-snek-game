import { _decorator, Component } from "cc";
import ShopeeWebBridge from "../../lib/webBridge/shopeeWebBridge";
const { ccclass, property } = _decorator;

@ccclass("TitleScene")
export class TitleScene extends Component {
  onLoad () {
    ShopeeWebBridge.configurePage({
      showNavbar: false,
    });
  }

  start() {

  }
}

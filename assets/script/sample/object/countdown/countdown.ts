import { COUNTDOWN_EVENT } from "./../../enum/countdown";
import { CountdownChangeEventParam } from "./../../interface/countdown";
import { _decorator, Component, Node, UIOpacity, tween } from "cc";
import { CountdownText } from "../../text/countdownText";
import { CountdownManager } from "./countdownManager";
const { ccclass, property } = _decorator;

@ccclass("Countdown")
export class Countdown extends Component {
  @property(CountdownManager)
  countdownManager?: CountdownManager;

  @property(CountdownText)
  countdownText?: CountdownText;

  uiOpacity: UIOpacity | null = null;

  onLoad() {
    this.uiOpacity = this.getComponent(UIOpacity);
    this.countdownManager?.node.on(
      COUNTDOWN_EVENT.COUNTDOWN_CHANGE,
      this.handleCountdownChange,
      this
    );
    this.countdownManager?.node.on(
      COUNTDOWN_EVENT.COUNTDOWN_END,
      this.handleCountdownEnd,
      this
    );
  }

  handleCountdownChange(ev: CountdownChangeEventParam) {
    this.countdownText?.updateText(String(ev.countdown));
  }

  handleCountdownEnd() {
    this.fadeOut();
    this.countdownText?.fadeText();
  }

  fadeOut() {
    tween(this.uiOpacity)
      .to(1, {
        opacity: 0,
      })
      .start();
  }
}

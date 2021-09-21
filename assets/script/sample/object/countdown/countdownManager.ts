import { _decorator, Component, Node } from "cc";
import { COUNTDOWN_EVENT } from "../../enum/countdown";
import { CountdownChangeEventParam } from "../../interface/countdown";
const { ccclass, property } = _decorator;

@ccclass("CountdownManager")
export class CountdownManager extends Component {
  private currentCount = 3;

  initChangeCountdownEvent(param: CountdownChangeEventParam) {
    this.node.emit(COUNTDOWN_EVENT.COUNTDOWN_CHANGE, param);
  }

  startCountdown() {
    this.node.emit(COUNTDOWN_EVENT.COUNTDOWN_START);
    this.initChangeCountdownEvent({ countdown: this.currentCount });
    this.schedule(this.countdownHandler, 1);
  }

  countdownHandler() {
    this.currentCount = this.currentCount - 1;
    this.initChangeCountdownEvent({ countdown: this.currentCount });
    if (this.currentCount === 1) {
      this.unschedule(this.countdownHandler);
    }
  }

  public end() {
    this.node.emit(COUNTDOWN_EVENT.COUNTDOWN_END);
  }
}

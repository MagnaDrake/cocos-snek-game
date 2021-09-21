import { _decorator, Component, Graphics, UITransform } from "cc";
import { BaseText } from "../../lib/text/baseText";
import { formatTime } from "../../lib/util/time";
const { ccclass, property } = _decorator;

@ccclass("TimerUI")
export class TimerUI extends Component {
  @property(Graphics)
  private timerBackground?: Graphics;
  @property(BaseText)
  private timerText?: BaseText;

  private currentTime?: number;
  private endTime?: number;

  start() {
    this.drawTimerBackground();
  }

  public startTimer() {
    this.schedule(this.updateTimeText, 0.5);
  }

  public stopTimer() {
    this.unschedule(this.updateTimeText);
  }

  public setCurrentTime(time: number | undefined) {
    if (!time) return;
    this.currentTime = time;
  }

  public setEndTime(time: number | undefined) {
    if (!time) return;
    this.endTime = time;
  }

  private setTimerText(text: string) {
    const { timerText } = this;
    if (!timerText) return;
    timerText.setText(text);
  }

  public setManualTimeLeft(timeDistance: number) {
    const formattedTime = formatTime(timeDistance);
    this.setTimerText(formattedTime);
  }

  private updateTimeText() {
    const { endTime, currentTime } = this;
    if (!endTime || !currentTime) return;
    const timeDistance = endTime - currentTime;
    const formattedTime = formatTime(timeDistance);
    this.setTimerText(formattedTime);
  }

  private drawTimerBackground() {
    const { timerBackground } = this;
    const uiTransform = this.timerBackground?.getComponent(UITransform);
    if (!uiTransform) return;
    const { width, height } = uiTransform;

    timerBackground?.roundRect(width * -0.5, height * -0.5, width, height, 20);
    timerBackground?.fill();
  }
}

import { _decorator, Component } from "cc";
import { TIME_MANAGER_EVENT } from "../enum/timeManager";
import { TimerUI } from "./header/timer";

const { ccclass, property } = _decorator;

@ccclass("TimeManager")
export class TimeManager extends Component {
  @property(TimerUI)
  public readonly timerUI?: TimerUI;

  private currentTime?: number;
  private endTime?: number;

  private timerStatus?: boolean = false;

  /**
   * Begins the timer
   * @param {number} endTime end time in millis epoch
   */
  public beginTimer(endTime: number | undefined) {
    if (!endTime) {
      return;
    }
    this.setEndTime(endTime);
    this.startTimer();
  }

  public setTimerStatus(status: boolean) {
    this.timerStatus = status;
  }

  public setCurrentTime(time: number) {
    this.currentTime = time;
    this.timerUI?.setCurrentTime(time);
  }

  public setManualTimeLeft(timeDistance: number) {
    this.timerUI?.setManualTimeLeft(timeDistance);
  }
  
  public setEndTime(time: number) {
    this.endTime = time;
    this.timerUI?.setEndTime(time);
  }

  public startTimer() {
    this.timerUI?.startTimer();
    this.setTimerStatus(true);
  }

  public stopTimer() {
    this.timerUI?.stopTimer();
    this.setTimerStatus(false);
  }

  public getTimerStatus() {
    return this.timerStatus;
  }

  public getCurrentTime() {
    return this.currentTime;
  }
}

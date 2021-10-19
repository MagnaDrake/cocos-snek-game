import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

export enum PRELOAD_CONTROL_EVENT {
  TOUCH_END = "touch_end",
}

@ccclass("PreloadControl")
export class PreloadControl extends Component {
  public registerTouchEvent() {
    this.node.on(Node.EventType.TOUCH_END, () => {
      this.node.emit(PRELOAD_CONTROL_EVENT.TOUCH_END);
    });
  }
}

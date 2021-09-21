import { _decorator, Component, Node } from 'cc';
import { PRELOAD_CONTROL_EVENT } from '../enum/preloadControl';
const { ccclass, property } = _decorator;

@ccclass('PreloadControl')
export class PreloadControl extends Component {
    public registerTouchEvent() {
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    private onTouchEnd() {
        this.node.emit(PRELOAD_CONTROL_EVENT.TOUCH_END);
    }
}
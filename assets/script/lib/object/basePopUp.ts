import { _decorator, Component, Node, tween, v3 } from 'cc';
import { BASE_DIALOG_EVENT } from '../enum/dialog';
const { ccclass, property } = _decorator;

@ccclass('BasePopUp')
export class BasePopUp extends Component {
    protected readonly popInAnimationDuration = 0.5;

    protected readonly popOutAnimationDuration = 0.5;

    public show() {
        this.playPopInAnimation();
    }

    private playPopInAnimation() {
        const { node, popInAnimationDuration } = this;

        node.setScale(0, 0);
        tween(node).to(
            popInAnimationDuration,
            {
                scale: v3(1, 1, 1)
            },
            {
                onStart() {
                    node.active = true;
                },
                onComplete () {
                    node.emit(BASE_DIALOG_EVENT.POPPED_IN)
                }
            }
        ).start();
    }

    public hide() {
        this.playPopOutAnimation();
    }

    private playPopOutAnimation() {
        const { node, popOutAnimationDuration } = this;

        node.setScale(1, 1);
        tween(node).to(
            popOutAnimationDuration,
            {
                scale: v3(0, 0, 1)
            },
            {
                onComplete() {
                    node.active = false;
                    node.emit(BASE_DIALOG_EVENT.POPPED_OUT)
                }
            }
        ).start();
    }
}

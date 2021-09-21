import { _decorator, Component, EditBox } from 'cc';
import { TextButton } from '../button/textButton';
import { PLAY_BUTTON_GROUP_EVENT } from '../enum/playButtonGroup';
import { BUTTON_EVENT } from '../lib/enum/button';
const { ccclass, property } = _decorator;

@ccclass('PlayButtonGroup')
export class PlayButtonGroup extends Component {
    @property(EditBox)
    public readonly usernameEditBox?: EditBox;

    @property(TextButton)
    public readonly playButton?: TextButton;

    start() {
        this.playButton?.node.on(BUTTON_EVENT.TOUCH_END, this.onPlayButtonClick, this);
    }

    private onPlayButtonClick() {
        this.node.emit(PLAY_BUTTON_GROUP_EVENT.PLAY_BUTTON_CLICK, this.usernameEditBox?.string ?? '');
    }

    public setUsername(username: string) {
        const { usernameEditBox } = this;
        if (usernameEditBox) {
            usernameEditBox.string = username;
        }
    }
}

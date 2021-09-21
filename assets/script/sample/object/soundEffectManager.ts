
import { _decorator, Component, Node } from 'cc';
import { DieSfx } from '../audio/dieSfx';
import { EatSfx } from '../audio/eatSfx';
import { EatVoucherSfx } from '../audio/eatVoucherSfx';
import { SOUND_MANAGER_EVENT } from '../enum/soundManager';
import { BASE_AUDIO_EVENT } from '../lib/enum/audio';
import { SOCKET_FOOD_TYPE } from '../lib/enum/socket';
const { ccclass, property } = _decorator;

@ccclass('SoundEffectManager')
export class SoundEffectManager extends Component {
    @property(EatSfx)
    private readonly eatSfx?: EatSfx;

    @property(DieSfx)
    private readonly dieSfx?: DieSfx;

    @property(EatVoucherSfx)
    private readonly eatVoucherSfx?: EatVoucherSfx;

    onLoad () {
        this.dieSfx?.node.on(BASE_AUDIO_EVENT.ONE_SHOT_PLAYED, this.onDieSfxPlayed, this)
    }

    public playEatSfx (type: SOCKET_FOOD_TYPE) {
        if (type === SOCKET_FOOD_TYPE.BASIC) {
            this.eatSfx?.play();
        } else {
            this.eatVoucherSfx?.play();
        }
    }

    public playDieSfx () {
        this.dieSfx?.playOneShot();
    }

    private onDieSfxPlayed () {
        this.node.emit(SOUND_MANAGER_EVENT.DIE_SFX_PLAYED)
    }
}

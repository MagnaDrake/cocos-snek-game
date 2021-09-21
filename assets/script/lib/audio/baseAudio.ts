import { _decorator, Component, Node, AudioSource, AudioClip, assetManager, game } from 'cc';
import { GAME_EVENT } from '../enum/game';
import { getSoundStateFromLocalStorage } from '../util/localStorage';
const { ccclass, property } = _decorator;

@ccclass('BaseAudio')
export class BaseAudio extends Component {
    private audioSource?: AudioSource | null;

    private audioClip: AudioClip | null = null;

    constructor(
        name: string, 
        protected readonly audioKey: string,
        protected loop = false,
        protected volume = 1,
    ) {
        super(name);
    }

    onLoad() {
        game.on(GAME_EVENT.SOUND_STATE_CHANGE, this.onSoundStateChange, this);

        this.node.once(Node.EventType.NODE_DESTROYED, () => {
            game.off(GAME_EVENT.SOUND_STATE_CHANGE, this.onSoundStateChange, this);
        });
    }

    private onSoundStateChange() {
        this.setVolume(this.volume);
    }

    private isMuted() {
        return !getSoundStateFromLocalStorage();
    }

    private setVolume(volume: number) {
        const { audioSource } = this;

        if (!audioSource) return;

        if (this.isMuted()) {
            audioSource.volume = 0;
        } else {
            audioSource.volume = volume;
        }

        this.volume = volume;
    }

    private reload(vol?: number) {
        this.audioSource = this.getComponent(AudioSource);
        this.audioClip = this.getAudioClip();
        this.setupAudio(vol);
    }

    private getAudioClip() {
        return assetManager.assets.get(this.audioKey) as AudioClip;
    }

    private setupAudio(vol?: number) {
        const { audioSource, audioClip, loop, volume } = this;

        if (!audioSource || !audioClip) return;

        audioSource.clip = audioClip;
        audioSource.loop = loop;
        this.setVolume(vol ?? volume);
    }

    public play(vol?: number) {
        this.reload(vol);
        this.audioSource?.play();
    }

    public stop() {
        this.audioSource?.stop();
    }

    public replay(vol?: number) {
        this.stop();
        this.play(vol);
    }
}

import { _decorator, Component, Node, AudioSource, AudioClip, assetManager, director, game } from 'cc';
import { BASE_AUDIO_EVENT } from '../enum/audio';
import { GAME_EVENT } from '../enum/game';
import { getSoundStateFromLocalStorage } from '../util/localStorage';
const { ccclass, property } = _decorator;

@ccclass('BaseAudio')
export class BaseAudio extends Component {
    private readonly ONE_SHOT_DELAY = 200;

    private audioSource?: AudioSource | null;
    private audioClip: AudioClip | null = null;

    private lastPlayOneShot = 0;

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

    play (vol?: number) {
        this.reload(vol);
        this.audioSource?.play();
    }

    /** 
     * Used for playing sound effect which has these the following characteristics:
     * - Short playback time
     * - A large number of simultaneous playback
     * 
     * @param callback Function to be called after the audio duration
     */
    playOneShot () {
        this.reload();

        const { audioClip, audioSource, ONE_SHOT_DELAY } = this
        if (!audioSource || !audioClip) return;

        const delay = Date.now() - this.lastPlayOneShot;
        if (delay < ONE_SHOT_DELAY) return;

        audioSource.playOneShot(audioClip);
        this.lastPlayOneShot = Date.now();
        this.scheduleOnce(this.onOneShotPlayed, audioClip.getDuration())
    }

    private onOneShotPlayed () {
        this.node.emit(BASE_AUDIO_EVENT.ONE_SHOT_PLAYED)
    }

    stop() {
        this.audioSource?.stop();
    }

    replay (vol?: number) {
        const { audioSource } = this
        if (!audioSource) return;

        audioSource.currentTime = 0;
        this.play(vol);
    }
}

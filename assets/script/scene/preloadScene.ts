import { _decorator, Component, director, find, instantiate, game } from 'cc';
import { BackgroundMusic } from '../audio/backgroundMusic';
import { getAssets } from '../config/asset';
import { PreloadControl } from '../control/preloadControl';
import { ASSET_KEY } from '../enum/asset';
import { PRELOAD_CONTROL_EVENT } from '../enum/preloadControl';
import { SCENE_KEY } from '../enum/scene';
import { ASSET_LOADER_EVENT } from '../lib/enum/assetLoader';
import { AssetLoader } from '../lib/loader/assetLoader';
import { AssetLoadingUI } from '../lib/loader/assetLoadingUI';
import ShopeeWebBridge from '../lib/webBridge/shopeeWebBridge';
const { ccclass, property } = _decorator;

@ccclass('PreloadScene')
export class PreloadScene extends Component {
    @property(AssetLoader)
    public readonly assetLoader?: AssetLoader;

    @property(AssetLoadingUI)
    public readonly assetLoadingUI?: AssetLoadingUI;

    @property(PreloadControl)
    public readonly preloadControl?: PreloadControl;

    @property(BackgroundMusic)
    public readonly backgroundMusic?: BackgroundMusic | null;

    onLoad () {
        this.setupWebBridge();
    }

    private setupWebBridge () {
        const isWebBridgeReady = ShopeeWebBridge.init();
        if (!isWebBridgeReady) return;

        ShopeeWebBridge.configurePage({
            showNavbar: true,
            title: 'Shopee Chicks',
        })
    }

    start() {
        this.startAssetsLoad();
    }

    private startAssetsLoad() {
        const { assetLoader } = this;

        assetLoader?.node.on(ASSET_LOADER_EVENT.START, this.onAssetLoaderStart, this);
        assetLoader?.node.on(ASSET_LOADER_EVENT.ASSET_LOAD_SUCCESS, this.onAssetLoadSuccess, this);
        assetLoader?.node.on(ASSET_LOADER_EVENT.COMPLETE, this.onAssetLoaderComplete, this);

        assetLoader?.startAssetsLoad(getAssets());
    }

    private onAssetLoaderStart(progress: number) {
        this.assetLoadingUI?.updateText(progress);
    }

    private onAssetLoadSuccess(progress: number, key: string) {
        this.assetLoadingUI?.updateText(progress, key);
    }

    private onAssetLoaderComplete(progress: number) {
        this.assetLoadingUI?.updateText(progress);
        this.onComplete();
    }

    private onComplete() {
        const { preloadControl } = this;

        this.spawnBackgroundMusic();
        preloadControl?.registerTouchEvent();
        preloadControl?.node.once(PRELOAD_CONTROL_EVENT.TOUCH_END, this.goToTitleScene, this);
    }

    private goToTitleScene() {
        director.loadScene(SCENE_KEY.TITLE, () => {
            /** Get the background music persist node. */
            const persistBackgroundMusicNode = find('BackgroundMusic');
            const backgroundMusicAudioSource = persistBackgroundMusicNode?.getComponent(BackgroundMusic);
            /** Play/replay the music of the peristent background music node. */
            backgroundMusicAudioSource?.replay(.5);
        });
    }

    private spawnBackgroundMusic () {
        const { backgroundMusic } = this;
        if (!backgroundMusic) return;

        /**
         * Play audio with `0` volume to trigger browser autoplay policy.
         * This audio node will only exists in this scene.
         */
        backgroundMusic.play(0);

        /** Add background music node as persist root node. */
        game.addPersistRootNode(backgroundMusic.node);
    }
}
import { _decorator, Component, director } from 'cc';
import { ASSET_LOADER_EVENT } from '../../lib/enum/assetLoader';
import { AssetLoader } from '../../lib/loader/assetLoader';
import { AssetLoadingUI } from '../object/loading/assetLoadingUI';
import ShopeeWebBridge from '../../lib/webBridge/shopeeWebBridge';
import { getAssets } from '../config/asset';
import { SCENE_KEY } from '../enum/scene';
const { ccclass, property } = _decorator;

@ccclass('PreloadScene')
export class PreloadScene extends Component {
    @property(AssetLoader)
    public readonly assetLoader?: AssetLoader;

    @property(AssetLoadingUI)
    public readonly assetLoadingUI?: AssetLoadingUI;
    
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
        this.spawnBackgroundMusic();
    }

    private goToTitleScene() {
        director.loadScene(SCENE_KEY.TITLE);
    }

    private spawnBackgroundMusic () {
        
    }
}
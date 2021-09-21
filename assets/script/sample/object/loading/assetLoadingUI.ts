import { _decorator, Component } from 'cc';
import { BaseLabel } from '../../../lib/text/baseLabel';
import { LoadingBar } from './loadingBar';
const { ccclass, property } = _decorator;

@ccclass('AssetLoadingUI')
export class AssetLoadingUI extends Component {
    @property(BaseLabel)
    public percentLoadText?: BaseLabel;

    @property(BaseLabel)
    public urlLoadText?: BaseLabel;

    @property(LoadingBar)
    public readonly loadingBar?: LoadingBar; 

    public updateText(progress: number, key?: string) {
        const { percentLoadText, urlLoadText } = this;
        const progressPercent = Math.floor(progress * 100);
        
        this.loadingBar?.drawInnerGraphics(progressPercent);

        if (percentLoadText) {
            percentLoadText.setText(`${progressPercent}%`);
        }
        
        if (urlLoadText) {
            switch(progressPercent) {
                case 100: {
                    urlLoadText.setText('CLICK TO ENTER');
                    break;
                }

                case 0: {
                    urlLoadText.setText('LOADING...');
                    break;
                }

                default: {
                    urlLoadText.setText(`${key}`);
                    break;
                }
            }
        }
    }
}

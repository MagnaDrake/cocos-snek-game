import { _decorator, Component, Node, RichText } from 'cc';
import { BaseText } from '../text/baseText';
import { LoadingBar } from './loadingBar';
const { ccclass, property } = _decorator;

@ccclass('AssetLoadingUI')
export class AssetLoadingUI extends Component {
    @property(BaseText)
    public percentLoadText?: BaseText;

    @property(BaseText)
    public urlLoadText?: BaseText;

    @property(LoadingBar)
    public readonly loadingBar?: LoadingBar; 

    public updateText(progress: number, key?: string) {
        const { percentLoadText, urlLoadText } = this;
        const progressPercent = Math.floor(progress * 100);
        
        this.loadingBar?.drawInnerGraphics(progressPercent);

        if (percentLoadText) {
            percentLoadText.setText(
              `<outline width=4>${progressPercent}%</outline>`
            );
        }
        
        if (urlLoadText) {
            switch(progressPercent) {
                case 100: {
                    urlLoadText.setText('CLICK TO ENTER');
                    break;
                }

                // case 0: {
                //     urlLoadText.setText('LOADING...');
                //     break;
                // }

                // default: {
                //     urlLoadText.setText(`${key}`);
                //     break;
                // }
            }
        }
    }
}

import { _decorator, Component, Node, RichText, assetManager, TTFFont, Color } from 'cc';
import { getTextWithColor } from '../util/richText';
const { ccclass, property } = _decorator;

/**
 * @deprecated currently RichText has no clear benefit compared to Label while being much more complicated to use, so use BaseLabel instead
 */
@ccclass('BaseText')
export class BaseText extends Component {
    @property(Color)
    public textColor = new Color(255, 255, 255);

    protected richText?: RichText | null;

    constructor(
        name: string,
        protected fontKey: string,
    ) {
        super(name);
    }

    onLoad() {
        this.reload();
        this.reloadTextWithAssignedColor();
    }

    protected reload() {
        this.richText = this.getComponent(RichText);
        this.setupFont();
    }

    protected reloadTextWithAssignedColor() {
        const { string } = this.richText || { string: '' };
        this.setText(string);
    }

    protected setupFont() {
        const { richText } = this;
        if (richText) {
            richText.font = this.getFont();
        }
    }

    protected getFont() {
        return assetManager.assets.get(this.fontKey) as TTFFont;
    }

    public setText(text: string) {
        this.reload();
        
        const { richText, textColor } = this;
        if (richText) {
            richText.string = getTextWithColor(text, textColor);
        }
    }
}

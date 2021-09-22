import {
  _decorator,
  Component,
  assetManager,
  TTFFont,
  Label,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("BaseLabel")
export class BaseLabel extends Component {
  protected label?: Label | null;

  constructor(name: string, protected fontKey: string) {
    super(name);
  }

  onLoad() {
    this.reload();
  }

  public setText(text: string) {
    this.reload();
    const { label } = this;
    if (label) {
      label.string = text;
    }
  }

  public reload() {
    if (!this.label) {
      this.label = this.getComponent(Label);
    }
    this.setupFont();
  }

  protected setupFont() {
    const { label } = this;
    if (label && !label.font) {
      label.font = this.getFont();
    }
  }

  protected getFont() {
    return assetManager.assets.get(this.fontKey) as TTFFont;
  }
}

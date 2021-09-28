import {
  _decorator,
  Component,
  assetManager,
  TTFFont,
  Label,
  Color,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("BaseLabel")
export class BaseLabel extends Component {
  protected label?: Label | null;

  public get Text() {
    return this.label?.string;
  }

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

  public setColor(color: Color) {
    this.reload();
    if (this.label) {
      this.label.color = color;
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

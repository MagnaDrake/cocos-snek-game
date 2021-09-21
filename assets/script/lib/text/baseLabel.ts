import {
  _decorator,
  Component,
  assetManager,
  TTFFont,
  Color,
  Label,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("BaseLabel")
export class BaseLabel extends Component {
  @property(Color)
  public textColor = new Color(255, 255, 255);

  protected label?: Label | null;

  constructor(name: string, protected fontKey: string) {
    super(name);
  }

  onLoad() {
    this.reload();
  }

  protected reload() {
    this.label = this.getComponent(Label);
    this.reloadColor();
    this.setupFont();
  }

  protected reloadColor() {
    const { label, textColor } = this;
    if (label) {
      label.color = textColor;
    }
  }

  protected setupFont() {
    const { label } = this;
    if (label) {
      label.font = this.getFont();
    }
  }

  protected getFont() {
    return assetManager.assets.get(this.fontKey) as TTFFont;
  }

  protected isFontLoaded() {
    return this.label?.useSystemFont;
  }

  protected loadLabelIfNotExist() {
    if (!this.label) {
      this.reload();
    }
  }

  public setText(text: string) {
    this.loadLabelIfNotExist();
    const { label } = this;
    if (label) {
      label.string = text;
    }
  }

  update() {
    if (this.isFontLoaded()) {
      this.reload();
    }
  }
}

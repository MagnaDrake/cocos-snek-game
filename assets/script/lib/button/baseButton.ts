import {
  _decorator,
  Button,
  Sprite,
  assetManager,
  SpriteFrame,
  UITransform,
  Label,
  TTFFont,
} from "cc";
import { getSpriteFrameKey } from "../util/spritesheet";
const { ccclass, property } = _decorator;

@ccclass("BaseButton")
export class BaseButton extends Button {
  protected sprite?: Sprite | null;

  protected labelChild?: Label | null;

  protected uiTransform?: UITransform | null;

  protected presetDimension = { width: 0, height: 0 };

  constructor(
    name: string,
    protected textureKey: string,
    protected frameKey?: number,
    protected fontKey?: string
  ) {
    super(name);
  }

  onLoad() {
    this.reload();
  }

  public reload() {
    if (!this.sprite) {
      this.sprite = this.getComponent(Sprite);
    }
    if (!this.labelChild) {
      this.labelChild = this.getComponentInChildren(Label);
    }
    if (!this.presetDimension) {
        this.presetDimension = this.getPresetDimension();
    }

    this.setupSprite();
    this.setupFont();
    this.adjustSize();
  }

  public setText(text: string) {
    this.reload();
    if (this.labelChild) {
      this.labelChild.string = text;
    }
  }

  protected getSpriteFrame(textureKey?: string, frameKey?: number) {
    return assetManager.assets.get(
      getSpriteFrameKey(
        textureKey || this.textureKey,
        frameKey || this.frameKey
      )
    ) as SpriteFrame;
  }

  protected setupSprite(textureKey?: string, frameKey?: number) {
    if (this.sprite) {
      this.sprite.spriteFrame = this.getSpriteFrame(textureKey, frameKey);
    }
    this.normalSprite = this.getSpriteFrame(textureKey, frameKey);
  }

  protected getPresetDimension() {
    const { presetDimension, uiTransform } = this;

    if (!uiTransform) return presetDimension;

    const { width, height } = uiTransform;
    return { width, height };
  }

  protected adjustSize() {
    const { uiTransform, presetDimension } = this;
    const { width, height } = presetDimension;

    uiTransform?.setContentSize(width, height);
  }

  protected setupFont() {
    if (this.labelChild) {
      const newFont = this.getFont();
      if (newFont && !this.labelChild.font) {
        this.labelChild.font = newFont;
      }
    }
  }

  protected getFont() {
    if (!this.fontKey) return undefined;
    return assetManager.assets.get(this.fontKey) as TTFFont;
  }
}

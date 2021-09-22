import { _decorator, Component, Sprite, assetManager, SpriteFrame, Animation, UITransform, Color, Vec3, color } from 'cc';
import { getSpriteFrameKey } from '../util/spritesheet';
const { ccclass, property } = _decorator;

@ccclass('BaseSprite')
export class BaseSprite extends Component {
    protected sprite?: Sprite | null;

    protected uiTransform?: UITransform | null;

    protected animation?: Animation | null;

    protected presetDimension = { width: 0, height: 0 };

    constructor(
        name: string,
        protected textureKey: string,
        protected frameKey?: number | string,
    ) {
        super(name);
    }

    onLoad() {
        this.reload();
    }

    public reload() {
        this.sprite = this.getComponent(Sprite);
        this.uiTransform = this.getComponent(UITransform);
        this.animation = this.getComponent(Animation);
        this.presetDimension = this.getPresetDimension();
        
        this.setupSprite();
        this.adjustSize();
    }

    /**
     * @param opacity 0 to 255
     */
    public setOpacity(opacity: number): void {
        const { r, g, b } = this.sprite?.color || { r: 255, g: 255, b: 255 };
        this.setColor(color(r, g, b, opacity));
    }

    public setColor(color: Color): void {
        if (this.sprite) {
            this.sprite.color = color;
        }
    }

    public setRotation(rotation: Vec3): void {
        this.node.setRotationFromEuler(rotation);
    }

    public setActive(active: boolean): void {
        this.node.active = active;
    }

    public setFrame(frameKey?: number | string): void {
        this.frameKey = frameKey;
        this.setupSprite();
    }

    public setTexture(textureKey: string, frameKey?: number | string): void {
        this.textureKey = textureKey;
        this.frameKey = frameKey;
        this.setupSprite();
    }

    protected getPresetDimension() {
        const { presetDimension, uiTransform } = this;

        if (!uiTransform) return presetDimension;

        const { width, height } = uiTransform;
        return { width, height };
    }

    protected getSpriteFrame() {
        return assetManager.assets.get(getSpriteFrameKey(this.textureKey, this.frameKey)) as SpriteFrame;
    }

    protected setupSprite() {
        if (this.sprite) {
            this.sprite.spriteFrame = this.getSpriteFrame();
        }
    }

    protected adjustSize() {
        const { uiTransform, presetDimension } = this;
        const { width, height } = presetDimension;

        uiTransform?.setContentSize(width, height);
    }
}

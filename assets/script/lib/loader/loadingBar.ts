import { _decorator, Component, Node, Graphics, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LoadingBar')
export class LoadingBar extends Component {
    @property(Graphics)
    public readonly outerGraphics?: Graphics;

    @property(Graphics)
    public readonly innerGraphics?: Graphics;

    @property(Graphics)
    public readonly baseGraphics?: Graphics;

    private uiTransform?: UITransform | null;

    onLoad() {
        this.uiTransform = this.getComponent(UITransform);

        this.draw();
    }

    private getOuterGraphicsConfig() {
        const { uiTransform } = this;

        if (!uiTransform) return undefined;

        const { width, height } = uiTransform;

        return {
            x: width * -0.5,
            y: height * -0.5,
            width,
            height,
            r: Math.min(width, height) * 0.5,
        };
    }

    private getInnerGraphicsConfig(progress: number) {
        const { uiTransform } = this;

        if (!uiTransform) return undefined;

        const { width, height } = uiTransform;
        const fullWidth = width - 12.5;
        const innerWidth = fullWidth * (progress / 100);
        const innerHeight = height - 12.5;

        return {
            x: fullWidth * -0.5,
            y: innerHeight * -0.5,
            width: innerWidth,
            height: innerHeight,
            r: Math.min(innerWidth, innerHeight) * 0.5,
        };
    }

    private getBaseGraphicsConfig() {
        const { uiTransform } = this;

        if (!uiTransform) return undefined;

        const { width, height } = uiTransform;
        const innerWidth = width - 12.5;
        const innerHeight = height - 12.5;

        return {
            x: innerWidth * -0.5,
            y: innerHeight * -0.5,
            width: innerWidth,
            height: innerHeight,
            r: Math.min(innerWidth, innerHeight) * 0.5,
        };
    }

    private draw() {
        this.drawOuterGraphics();
        this.drawBaseGraphics();
    }

    private drawOuterGraphics() {
        const { outerGraphics } = this;
        const config = this.getOuterGraphicsConfig();

        if (!outerGraphics || !config) return;

        const { x, y, width, height, r } = config;

        outerGraphics.roundRect(x, y, width, height, r);
        outerGraphics.fill();
    }

    private drawBaseGraphics() {
        const { baseGraphics } = this;
        const config = this.getBaseGraphicsConfig();

        if (!baseGraphics || !config) return;

        const { x, y, width, height , r } = config;

        baseGraphics.roundRect(x, y, width, height, r);
        baseGraphics.fill();
    }

    public drawInnerGraphics(progress: number) {
        const { innerGraphics } = this;
        const config = this.getInnerGraphicsConfig(progress);

        if (!innerGraphics || !config) return;

        const { x, y, width, height, r } = config;

        innerGraphics.clear();
        innerGraphics.roundRect(x, y, width, height, r);
        innerGraphics.fill();
    }
}

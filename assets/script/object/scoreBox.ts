import { _decorator, Component, Node, Graphics, Color, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScoreBox')
export class ScoreBox extends Component {
    @property(Graphics)
    public readonly backgroundGraphics?: Graphics;

    @property(Color)
    public readonly backgroundColorGraphics: Color = new Color(255, 255, 255);

    private uiTransform?: UITransform | null;

    onLoad() {
        this.uiTransform = this.getComponent(UITransform);

        this.draw();
    }

    private getGraphicsConfig () {
        const { uiTransform, backgroundColorGraphics } = this;

        if (!uiTransform || !backgroundColorGraphics) return undefined;

        const { width, height } = uiTransform;

        return {
            color: backgroundColorGraphics,
            x: width * -0.5,
            y: height * -0.5,
            width: width,
            height: height,
            r: Math.min(width, height) * 0.1,
        };
    }

    private draw () {
        const { backgroundGraphics } = this;
        const config = this.getGraphicsConfig();

        if (!backgroundGraphics || !config) return;

        const { color, x, y, width, height, r } = config;

        backgroundGraphics.fillColor = color;
        backgroundGraphics.roundRect(x, y, width, height, r);
        backgroundGraphics.fill();
    }
}
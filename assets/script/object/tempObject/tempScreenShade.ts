import { _decorator, Component, Node, UITransform, Graphics } from 'cc';
const { ccclass, property } = _decorator;

// TO-DO: Replace this with actual UI
@ccclass('TempScreenShade')
export class TempScreenShade extends Component {
    private graphics?: Graphics | null;
    
    private uiTransform?: UITransform | null;
    
    onLoad() {
        this.graphics = this.getComponent(Graphics);
        this.uiTransform = this.getComponent(UITransform);
    }

    start() {
        this.drawScreenShade();
    }

    private getScreenShadeConfig() {
        const { uiTransform } = this;

        if (!uiTransform) return undefined;

        const { width, height } = uiTransform;

        return {
            x: width * -0.5,
            y: height * -0.5,
            width,
            height,
        };
    }

    private drawScreenShade() {
        const { graphics } = this;
        const config = this.getScreenShadeConfig();

        if (!graphics || !config) return;

        const { x, y, width, height } = config;

        graphics.rect(x, y, width, height);
        graphics.fill();
    }

    public hide() {
        this.node.active = false;
    }
}
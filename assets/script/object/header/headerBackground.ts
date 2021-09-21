import { _decorator, Component, Node, Graphics, UITransform } from "cc";
const { ccclass, property } = _decorator;

@ccclass("HeaderBackground")
export class HeaderBackground extends Component {
  onLoad() {
    this.drawHeaderBackground();
  }

  private drawHeaderBackground() {
    const headerBackground = this?.getComponent(Graphics);
    const uiTransform = this?.getComponent(UITransform);
    if (!uiTransform) return;
    const { width, height } = uiTransform;

    headerBackground?.roundRect(width * -0.5, height * -0.5, width, height, 50);
    headerBackground?.fill();
  }
}

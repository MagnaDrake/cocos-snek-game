import { _decorator, Component, Node, UITransform } from "cc";
const { ccclass, property } = _decorator;

/**
 * @deprecated Do not use this anymore, use UI to cover instead
 */
@ccclass("GameplayMask")
export class GameplayMask extends Component {
  /**
   * Move mask (used to adjust mask when GameplayCamera moves)
   * @param x number
   * @param y number
   */
  public setMaskPosition(x: number, y: number) {
    /**
     * Adjust the mask's position
     */
    this.node.setPosition(x, y);

    /**
     * Adjust the children's position to offset the mask's movement (because moving the masks also move the children)
     */
    this.node.children.forEach((child) => {
      child.setPosition(-x, -y);
    });
  }

  // TO-DO: if this is called multiple times, better move getComponent to onLoad
  public setDimensionByCameraScale(scale: number) {
    const uiTransform = this.getComponent(UITransform);

    if (!uiTransform) return;

    uiTransform.width = uiTransform.width * scale;
    uiTransform.height = uiTransform.height * scale;
  }
}

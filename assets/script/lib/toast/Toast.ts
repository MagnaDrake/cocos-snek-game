import { ToastItem } from "./ToastItem";
import {
  _decorator,
  Component,
  Node,
  instantiate,
  game,
  find,
  director,
  Canvas,
} from "cc";
import { TToastOption } from "../interface/toast";
const { ccclass, property } = _decorator;

@ccclass("Toast")
export class Toast extends Component {
  @property(ToastItem)
  public readonly toastItemTemplate?: ToastItem;
  private static parentCanvasNode: Node;

  onLoad() {
    this.initParentCanvas();
  }

  initParentCanvas() {
    const parentCanvas = this.node.parent?.getComponent(Canvas);
    if (!parentCanvas) {
      throw new Error("The toast component should have a canvas parent !");
    }
    parentCanvas.node.parent = null;
    Toast.parentCanvasNode = parentCanvas.node;
    game.addPersistRootNode(parentCanvas.node);
  }

  public static show(message: string, option: Partial<TToastOption> = {}) {
    const currentToast = Toast.parentCanvasNode.getComponentInChildren(Toast);
    if (!currentToast) {
      throw new Error(
        "Current Toast not found. you probably have not yet add any Toast component on current active screen"
      );
    }
    currentToast.node.parent = Toast.parentCanvasNode;
    currentToast._show(message, option);
  }

  _show(message: string, option: Partial<TToastOption> = {}) {
    if (!this.toastItemTemplate) {
      throw new Error(
        "toastItemTemplate not exist when calling _show method in Toast"
      );
    }
    const toastItemNode = instantiate(this.toastItemTemplate.node)!;
    toastItemNode.active = true;
    toastItemNode.parent = this.node;
    const toastItem = toastItemNode.getComponent(ToastItem);
    toastItem?.init(option);
    toastItem?.setText(message);
  }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */

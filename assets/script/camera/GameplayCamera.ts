import {
  _decorator,
  Component,
  lerp,
  Camera,
  view,
  Node,
} from "cc";
import { GAMEPLAY_CAMERA_EVENT } from "../enum/gameplayCamera";
import { PlayerInstance } from "../interface/player";
const { ccclass, property } = _decorator;

@ccclass("GameplayCamera")
export class GameplayCamera extends Component {
  private defaultOrthoHeight = 320;

  private playerToFollow?: PlayerInstance;

  private camera?: Camera | null;

  onLoad() {
    this.camera = this.getComponent(Camera);
  }

  public setPlayerToFollow(playerInstance: PlayerInstance) {
    this.playerToFollow = playerInstance;
    this.node.emit(GAMEPLAY_CAMERA_EVENT.LOCK_ON);
  }

  private updatePosition() {
    // TO-DO: add lerping
    const playerHead = this.playerToFollow?.object.getHead();
    if (playerHead) {
      const { x, y } = playerHead.position;
      this.moveTo(x, y);
    }
  }

  private moveTo(targetX: number, targetY: number) {
    const { x, y, z } = this.node.position;
    const lerpX = lerp(x, targetX, 1);
    const lerpY = lerp(y, targetY, 1);

    this.node.setPosition(lerpX, lerpY, z);
  }

  setCameraScale(scale: number) {
    const { camera, defaultOrthoHeight } = this;
    if (camera) {
      camera.orthoHeight = defaultOrthoHeight * scale;
    }
  }

  getCameraScale() {
    if (!this.camera) return 1;
    return this.camera.orthoHeight / this.defaultOrthoHeight;
  }

  lateUpdate() {
    this.updatePosition();
  }

  public isNodeVisibleInCamera(node: Node) {
    let { width, height } = view.getVisibleSize();
    const cameraScale = this.getCameraScale();
    width = width * cameraScale;
    height = height * cameraScale;
    const boundingX = node.position.x - this.node.position.x;
    const boundingY = node.position.y - this.node.position.y;
    if (
      boundingX > width * -0.55 &&
      boundingX < width * 0.55 &&
      boundingY > height * -0.55 &&
      boundingY < height * 0.55
    ) {
      return true;
    } else {
      return false;
    }
  }
}

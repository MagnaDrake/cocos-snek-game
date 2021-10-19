import {
  _decorator,
  Component,
  Node,
  Button,
  director,
  game,
  find,
  instantiate,
  Director,
} from "cc";
import { BackgroundMusic } from "../audio/backgroundMusic";
import { BUTTON_EVENT } from "../enum/button";
import { SCENE_KEY } from "../enum/scene";
import { TRANSITION_SCREEN_EVENT } from "../enum/transitionScreen";
import { BaseButton } from "../object/baseButton";
import { TransitionScreen } from "../sprite/transitionScreen";
const { ccclass, property } = _decorator;
@ccclass("TitleScene")
export class TitleScene extends Component {
  @property(Button)
  public readonly playButton?: BaseButton;

  @property(BackgroundMusic)
  public readonly backgroundSoundtrack?: BackgroundMusic;

  @property(TransitionScreen)
  public readonly transitionScreen?: TransitionScreen;

  onLoad() {}

  start() {}
}

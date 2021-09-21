import { _decorator, Component, director, Vec2 } from "cc";
import { BackButton } from "../button/backButton";
import { GameplayCamera } from "../camera/GameplayCamera";
import { SOCKET_FULL_PATH_URL } from "../config/socket";
import { GameControl } from "../control/gameControl";
import { CongratulationDialog } from "../dialog/CongratulationDialog";
import { CONGRATULATION_DIALOG_EVENT } from "../enum/congratulationDialog";
import { GAME_CONFIGURATION_EVENT } from "../enum/gameConfiguration";
import { GAME_CONTROL_EVENT } from "../enum/gameControl";
import { ROOM_MANAGER_EVENT } from "../enum/roomManager";
import { SCENE_KEY } from "../enum/scene";
import { TGameConfiguration } from "../interface/gameConfig";
import { PlayerInstance } from "../interface/player";
import { BUTTON_EVENT } from "../lib/enum/button";
import { Toast } from "../lib/toast/Toast";
import { getUsernameFromLocalStorage } from "../lib/util/localStorage";
import { Arena } from "../object/arena";
import { GameConfiguration } from "../object/gameConfiguration";
import { RoomManager } from "../object/roomManager";
import { TempScreenShade } from "../object/tempObject/tempScreenShade";
import { PlayerEndData } from "../interface/leaderboard";
import { GameOverDialog } from "../dialog/GameOverDialog";
import { GAME_OVER_DIALOG_EVENT } from "../enum/gameOverDialog";
import { DisconnectDialog } from "../dialog/DisconnectDialog";
import { TGameState, TPlayerScoreData } from "../interface/gameScene";
import { SOCKET_GAME_OVER_REASON } from "../lib/enum/socket";
import { CountdownManager } from "../object/countdown/countdownManager";
import { COUNTDOWN_EVENT } from "../enum/countdown";
import { CountdownChangeEventParam } from "../interface/countdown";
import { TimesUpDialog } from "../dialog/TimesUpDialog";
import { GAME_STATE } from "../enum/gameState";
import ShopeeWebBridge from "../lib/webBridge/shopeeWebBridge";
import { BASE_DIALOG_EVENT } from "../lib/enum/dialog";
import { GAMEPLAY_CAMERA_EVENT } from "../enum/gameplayCamera";
import { ClientPrediction } from "../object/prediction/clientPrediction";
const { ccclass, property } = _decorator;

@ccclass("GameScene")
export class GameScene extends Component {
  @property(BackButton)
  public readonly backButton?: BackButton;

  @property(RoomManager)
  public readonly roomManager?: RoomManager;

  @property(GameControl)
  public readonly gameControl?: GameControl;

  @property(GameConfiguration)
  public readonly gameConfiguration?: GameConfiguration;

  @property(Arena)
  public readonly gameArena?: Arena;

  @property(GameplayCamera)
  public readonly gameplayCamera?: GameplayCamera;

  @property(TempScreenShade)
  public readonly tempScreenShade?: TempScreenShade;

  @property(CongratulationDialog)
  public readonly congratulationDialog?: CongratulationDialog;

  @property(GameOverDialog)
  public readonly gameOverDialog?: GameOverDialog;

  @property(DisconnectDialog)
  public readonly disconnectDialog?: DisconnectDialog;

  @property(TimesUpDialog)
  public readonly timesUpDialog?: TimesUpDialog;

  @property(CountdownManager)
  public readonly countdownManager?: CountdownManager;

  @property(ClientPrediction)
  public readonly clientPrediction?: ClientPrediction;

  private gameState: TGameState = GAME_STATE.INIT;
  private isSuccessfullyReconnected: boolean = false;
  private readonly MAX_ATTEMPT = 10;

  onLoad() {
    ShopeeWebBridge.configurePage({
      showNavbar: false,
    });
  }

  start() {
    this.gameState = GAME_STATE.INIT;
    this.setupListeners();
    this.countdownManager?.startCountdown();

    /** Preload title scene to anticipate disconnect during playing the game. */
    director.preloadScene(SCENE_KEY.TITLE);
  }

  private setupListeners() {
    this.setupUIListeners();
    this.setupRoomManagerListeners();
    this.setupGameConfigurationListeners();
    this.setupCountdownListeners();
    this.setupGameplayCameraListeners();
  }

  private setupUIListeners() {
    this.backButton?.node.once(BUTTON_EVENT.TOUCH_END, this.onGameQuit, this);
    this.gameControl?.node.on(
      GAME_CONTROL_EVENT.JOYSTICK_MOVE,
      this.onJoystickMove,
      this
    );
  }

  private setupRoomManagerListeners() {
    this.roomManager?.node.once(
      ROOM_MANAGER_EVENT.JOIN,
      this.onGameStart,
      this
    );
    this.roomManager?.node.once(
      ROOM_MANAGER_EVENT.GAME_OVER,
      this.onGameEnd,
      this
    );
    this.roomManager?.node.once(
      ROOM_MANAGER_EVENT.DISCONNECT,
      this.onDisconnect,
      this
    );
    this.roomManager?.node.on(
      ROOM_MANAGER_EVENT.CONNECTION_OPENED,
      this.onConnectionOpened,
      this
    );
    this.roomManager?.node.on(
      ROOM_MANAGER_EVENT.PLAYER_INSTANCE_UPDATE,
      this.onPlayerInstanceUpdate,
      this
    );
  }

  private setupGameConfigurationListeners() {
    this.gameConfiguration?.node.on(
      GAME_CONFIGURATION_EVENT.FETCH_SUCCESS,
      this.onGameConfigFetch,
      this
    );
    this.gameConfiguration?.node.once(
      GAME_CONFIGURATION_EVENT.FETCH_FAIL,
      this.onFetchFailed,
      this
    );
  }

  private setupCountdownListeners() {
    this.countdownManager?.node.on(
      COUNTDOWN_EVENT.COUNTDOWN_CHANGE,
      this.onCountdownChange,
      this
    );
  }

  private setupGameplayCameraListeners() {
    this.gameplayCamera?.node.once(
      GAMEPLAY_CAMERA_EVENT.LOCK_ON,
      this.onceCameraLockOn,
      this
    );
  }

  private setupGameArena(config: TGameConfiguration) {
    const { width, height } = config;

    this.gameArena?.setup(width, height);
  }

  private setupCameraZoom() {
    const configuration = this.gameConfiguration?.getCombinedConfiguration();

    if (!configuration) return;

    const { camera_zoom } = configuration;

    this.gameplayCamera?.setCameraScale(camera_zoom);
  }

  private setupClientPrediction(config: TGameConfiguration) {
    this.clientPrediction?.setupPredictionConfig(config);
  }

  private startGame() {
    this.tempScreenShade?.hide();
    this.roomManager?.connect(
      getUsernameFromLocalStorage(),
      SOCKET_FULL_PATH_URL
    );
  }

  private onGameConfigFetch(config: TGameConfiguration) {
    this.setupGameArena(config);
    this.setupCameraZoom();
    this.setupClientPrediction(config);
    if (this.gameState !== GAME_STATE.STARTED) {
      this.startGame();
      return;
    }
  }

  private onGameStart() {
    this.gameState = GAME_STATE.STARTED;
  }

  private async refetchConfig(
    fn: Promise<void>,
    retries: number
  ): Promise<void> {
    if (retries <= 0) {
      // Redirect to LP
      this.onGameQuit();
      return;
    }
    return fn
      .then(() => {
        this.isSuccessfullyReconnected = true;
        this.disconnectDialog?.setActive(false);
        this.roomManager?.node.once(
          ROOM_MANAGER_EVENT.DISCONNECT,
          this.onDisconnect,
          this
        );
      })
      .catch(() => {
        return this.refetchConfig(fn, retries - 1);
      });
  }

  private async onConnectionOpened() {
    if (this.gameState === GAME_STATE.STARTED) {
      const { gameConfiguration } = this;
      if (gameConfiguration) {
        this.refetchConfig(gameConfiguration.fetch(), 10);
      }
    }
  }

  private handleGameOverDialogShow({
    killedBy,
    rank,
    points,
    voucherIds,
  }: TPlayerScoreData) {
    this.gameOverDialog?.showWithData(
      rank,
      points,
      killedBy === "SNAKE",
      voucherIds
    );
    this.gameOverDialog?.node.once(
      GAME_OVER_DIALOG_EVENT.PLAY_BUTTON_CLICK,
      this.onPlayAgain,
      this
    );
    this.gameOverDialog?.node.once(
      GAME_OVER_DIALOG_EVENT.BACK_TO_LP_BUTTON_CLICK,
      this.onGameQuit,
      this
    );
  }

  private handleCongratsDialogShow({
    rank,
    points,
    voucherIds,
  }: TPlayerScoreData) {
    this.congratulationDialog?.showWithData(rank, points, voucherIds);
    this.congratulationDialog?.node.once(
      CONGRATULATION_DIALOG_EVENT.PLAY_BUTTON_CLICK,
      this.onPlayAgain,
      this
    );
    this.congratulationDialog?.node.once(
      CONGRATULATION_DIALOG_EVENT.BACK_TO_LP_BUTTON_CLICK,
      this.onGameQuit,
      this
    );
  }

  private onGameEnd(
    playerEndData: PlayerEndData,
    gameOverReason: SOCKET_GAME_OVER_REASON,
    voucherIds: number[] | null
  ) {
    const { rank, points } = playerEndData;
    let killedBy: TPlayerScoreData["killedBy"];

    this.gameState = GAME_STATE.ENDED;

    switch (gameOverReason) {
      /** Show the game over dialog later after die sfx */
      case SOCKET_GAME_OVER_REASON.COLLIDE_SNAKE:
        killedBy = "SNAKE";
        break;
      /** Show the game over dialog later after die sfx */
      case SOCKET_GAME_OVER_REASON.COLLIDE_WALL:
        killedBy = "WALL";
        break;
      case SOCKET_GAME_OVER_REASON.TIMES_UP:
        /** Show time's up dialog first*/
        this.timesUpDialog?.show();

        /** Then show the congratulation dialog. TO-DO: refactor if possible / needed (don't use scheduleOnce) */
        this.scheduleOnce(() => {
          this.timesUpDialog?.hide();
        }, 1);

        this.timesUpDialog?.node.once(
          BASE_DIALOG_EVENT.POPPED_OUT,
          () => {
            this.handleCongratsDialogShow({ rank, points, voucherIds });
          },
          this
        );
        break;
    }

    this.roomManager?.node.once(
      ROOM_MANAGER_EVENT.DIE_SFX_PLAYED,
      () =>
        this.handleGameOverDialogShow({ killedBy, rank, points, voucherIds }),
      this
    );

    /**
     * TO-DO: seems dorty
     */
    this.clientPrediction?.setEnablePrediction(false);
  }

  private onDisconnect(roomID: string, playerID: string) {
    if (this.gameState !== GAME_STATE.STARTED) return;
    this.isSuccessfullyReconnected = false;
    this.disconnectDialog?.setActive(true);
    this.reconnectGame(roomID, playerID);
  }

  private reconnectGame(roomID: string, playerID: string) {
    const { MAX_ATTEMPT } = this;
    let attemptCount = 1;
    const callback = () => {
      if (this.isSuccessfullyReconnected) {
        this.unschedule(callback);
        return;
      }
      if (attemptCount === MAX_ATTEMPT) {
        this.unschedule(callback);
        // Redirect to LP page
        console.log("RECONNECT TIMEOUT, RETURN TO LP");
        this.onGameQuit();
        return;
      }
      console.log(`CONNECTION ATTEMPTED: ${attemptCount}/${MAX_ATTEMPT}`);
      this.roomManager?.connect(
        getUsernameFromLocalStorage(),
        SOCKET_FULL_PATH_URL,
        roomID,
        playerID
      );
      attemptCount += 1;
    };
    this.schedule(callback, 1);
  }

  private onPlayAgain() {
    director.loadScene(SCENE_KEY.GAME);
  }

  private onGameQuit() {
    director.loadScene(SCENE_KEY.TITLE);
  }

  private onFetchFailed() {
    Toast.show("Mohon Maaf. Server Sedang Sibuk");
    director.loadScene(SCENE_KEY.TITLE);
  }

  private onPlayerInstanceUpdate(
    playerInstance: PlayerInstance,
    isMainPlayer: boolean
  ) {
    if (isMainPlayer) {
      this.gameplayCamera?.setPlayerToFollow(playerInstance);
    }
  }

  private onCountdownChange(ev: CountdownChangeEventParam) {
    const { countdown } = ev;
    if (countdown === 1) {
      this.gameConfiguration?.fetch();
    }
  }

  private onceCameraLockOn() {
    this.countdownManager?.end();
  }

  private onJoystickMove(direction: Vec2) {
    // TO-DO: adjust this once player is ready
    this.roomManager?.setMoveData(direction);
  }
}

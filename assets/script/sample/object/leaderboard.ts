import { _decorator, Component, Node, Graphics, Color } from "cc";
import { ROOM_MANAGER_EVENT } from "../enum/roomManager";
import { LeaderboardText } from "../interface/leaderboard";
import { BaseText } from "../lib/text/baseText";
import { PlayerManager } from "./playerManager";
import { RoomManager } from "./roomManager";
const { ccclass, property } = _decorator;

@ccclass("Leaderboard")
export class Leaderboard extends Component {
  @property(BaseText)
  public firstPositionUsername?: BaseText;
  @property(BaseText)
  public secondPositionUsername?: BaseText;
  @property(BaseText)
  public thirdPositionUsername?: BaseText;
  @property(BaseText)
  public fourthPositionUsername?: BaseText;
  @property(BaseText)
  public fourthCrownPosition?: BaseText;
  @property(BaseText)
  public firstPositionScore?: BaseText;
  @property(BaseText)
  public secondPositionScore?: BaseText;
  @property(BaseText)
  public thirdPositionScore?: BaseText;
  @property(BaseText)
  public fourthPositionScore?: BaseText;

  @property(Graphics)
  public background?: Graphics;

  @property(RoomManager)
  public readonly roomManager?: RoomManager;

  @property(PlayerManager)
  public readonly playerManager?: PlayerManager;

  private leaderboardTexts = new Array<LeaderboardText>();

  start() {
    this.setupLeaderboardTexts();
    this.setupListeners();
  }

  private setupLeaderboardTexts() {
    this.leaderboardTexts = [
      {
        username: this.firstPositionUsername,
        score: this.firstPositionScore,
      },
      {
        username: this.secondPositionUsername,
        score: this.secondPositionScore,
      },
      {
        username: this.thirdPositionUsername,
        score: this.thirdPositionScore,
      },
      {
        username: this.fourthPositionUsername,
        score: this.fourthPositionScore,
        crown: this.fourthCrownPosition,
      },
    ];
  }

  private updateLeaderboardDisplay() {
    const { leaderboardTexts } = this;
    const currentLeaderboard = this.playerManager?.getCurrentLeaderboard();
    const currentPlayerID = this.playerManager?.getMainPlayerID();
    if (!currentLeaderboard) return;

    const lastDisplayedRankIdx = leaderboardTexts.length - 1;
    const currentPlayerRankIdx = currentLeaderboard.findIndex(
      (entry) => entry.id === currentPlayerID
    );
    leaderboardTexts.forEach((text, index) => {
      const playerRankIdx = (
        index === lastDisplayedRankIdx &&
        currentPlayerRankIdx > lastDisplayedRankIdx
      ) ? currentPlayerRankIdx : index;
      const playerRank = playerRankIdx + 1;

      const player = currentLeaderboard[playerRankIdx];
      if (!player) {
        this.updateLeaderboardText(text, undefined, undefined, playerRank);
        return;
      }
      
      const { id, username, points } = player;
      const isCurrentPlayer = id === currentPlayerID;
      this.updateLeaderboardText(text, username, points, playerRank, isCurrentPlayer);
    });
  }

  private updateLeaderboardText(
    leaderboardText: LeaderboardText,
    username?: string, 
    score?: number, 
    rank?: number, 
    isCurrentPlayer?: boolean
  ) {
    const { formatUsername, formatPoints } = this;
    const { username: ltUsername, score: ltScore, crown: ltCrown } = leaderboardText;

    ltUsername?.setText(
      (username === undefined) ? '' : formatUsername(username, isCurrentPlayer)
    );
    ltScore?.setText(
      (score === undefined) ? '' : formatPoints(score, isCurrentPlayer)
    );
    ltCrown?.setText(
      (rank === undefined) ? '' : String(rank)
    );
  }

  private formatUsername(input: string, isCurrentPlayer = false) {
    const ME_TEXT = "Me";
    let result = String(input);
    if (input.length > 6) {
      result = input.substring(0, 6) + "..";
    }
    if (isCurrentPlayer) {
      result = `<outline width=1>${ME_TEXT}</outline>`;
    }
    return result;
  }

  private formatPoints(input: number, isCurrentPlayer = false) {
    let result = "";
    result = input.toLocaleString();
    if (isCurrentPlayer) {
      result = `<outline width=1>${result}</outline>`;
    }
    return result;
  }

  private setupListeners() {
    this.roomManager?.node.on(ROOM_MANAGER_EVENT.JOIN, () =>
      this.schedule(this.updateLeaderboardDisplay, 1)
    );
    this.roomManager?.node.on(ROOM_MANAGER_EVENT.DISCONNECT, () => {
      this.updateLeaderboardDisplay();
      this.unschedule(this.updateLeaderboardDisplay);  
    });
  }
}

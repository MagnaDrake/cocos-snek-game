import { _decorator, Component, Node, instantiate } from "cc";
import { PLAYER_MANAGER_EVENT } from "../enum/playerManager";
import { PlayerEndData } from "../interface/leaderboard";
import { PlayerInstance } from "../interface/player";
import { PlayerState } from "../lib/interface/socket";
import { Player } from "./player";
const { ccclass, property } = _decorator;

@ccclass("PlayerManager")
export class PlayerManager extends Component {
  @property(Player)
  public readonly playerPrefab?: Player;

  @property(Node)
  public readonly playerGroup?: Node;

  private mainPlayerID = "";

  private players = new Map<string, PlayerInstance>();

  onLoad() {
    this.setupListeners();
  }

  private setupListeners() {
    this.node.on(
      PLAYER_MANAGER_EVENT.PLAYER_INSTANCE_CREATE,
      this.onPlayerInstanceCreate,
      this
    );
    this.node.on(
      PLAYER_MANAGER_EVENT.PLAYER_INSTANCE_UPDATE,
      this.onPlayerInstanceUpdate,
      this
    );
    this.node.on(
      PLAYER_MANAGER_EVENT.PLAYER_INSTANCE_DESTROY,
      this.onPlayerInstanceDestroy,
      this
    );
  }

  private onPlayerInstanceCreate(playerInstance: PlayerInstance) {
    const { state, object } = playerInstance;
    object.onStateCreate(state, this.isMainPlayer(state));
  }

  private onPlayerInstanceUpdate(playerInstance: PlayerInstance) {
    const { state, object } = playerInstance;
    object.onStateUpdate(state);
  }

  private onPlayerInstanceDestroy(playerInstance: PlayerInstance) {
    const { state, object } = playerInstance;
    object.onStateDestroy(state);
  }

  public setMainPlayerID(playerID: string) {
    this.mainPlayerID = playerID;
  }

  public getMainPlayerID() {
    return this.mainPlayerID;
  }

  public isMainPlayer(state: PlayerState) {
    return state.id === this.getMainPlayerID();
  }

  public updatePlayers(players: PlayerState[]) {
    if (!players) return;

    players.forEach(this.onPlayerStateUpdate, this);
    this.removeUnlistedPlayers(players);
  }

  public getCurrentLeaderboard() {
    const isKilled = (player: Partial<PlayerState>) => {
      // Check whether killed_info field is empty or not
      return !Boolean(player.killed_info);
    };
    return Array.from(this.players, ([id, playerInstance]) => ({
      id,
      username: playerInstance.state.username,
      points: playerInstance.state.points,
      killed_info: playerInstance.state.killed_info,
    }))
      .sort((a, b) => {
        if (a.points === b.points) {
          return a.id.localeCompare(b.id);
        }
        return b.points - a.points;
      })
      .filter(isKilled);
  }

  public getPlayerEndData(player?: PlayerInstance) {
    if (!player) {
      return {
        rank: 0,
        points: 9999,
      } as PlayerEndData;
    }

    const leaderboard = this.getCurrentLeaderboard();
    const { id, points } = player.state;
    return {
      rank: leaderboard.findIndex((entry) => entry.id === id) + 1,
      points,
    } as PlayerEndData;
  }

  /**
   * TO-DO: Remove this if not used anymore, since end data will used from game over message
   */
  public getMainPlayerEndData() {
    return this.getPlayerEndData(this.getMainPlayerInstance());
  }

  private onPlayerStateUpdate(player: PlayerState) {
    const { id } = player;

    if (this.playerInstanceExists(id)) {
      this.updatePlayerInstance(player);
    } else {
      this.createPlayerInstance(player);
    }
  }

  /**
   * Remove players that exist in the client, but does not exist in the server
   * @param players
   */
  private removeUnlistedPlayers(players: PlayerState[]) {
    this.getUnlistedPlayerIDs(players).forEach(
      this.destroyPlayerInstance,
      this
    );
  }

  public getPlayerInstanceByID(playerID: string) {
    return this.players.get(playerID);
  }

  public getMainPlayerInstance() {
    return this.getPlayerInstanceByID(this.getMainPlayerID());
  }

  private setPlayerInstanceByID(playerID: string, instance: PlayerInstance) {
    this.players.set(playerID, instance);
  }

  private unsetPlayerInstanceByID(playerID: string) {
    this.players.delete(playerID);
  }

  /**
   * PlayerIDs that exist in the client
   * @returns
   */
  public getExistingPlayerIDs() {
    return Array.from(this.players.keys());
  }

  /**
   * PlayerIDs that exist in the server
   * @param players
   * @returns
   */
  public getRemainingPlayerIDs(players: PlayerState[]) {
    return players.map((player) => player.id);
  }

  /**
   * PlayerIDs that exist in the client, but does not exist in the server
   * @param players
   * @returns
   */
  public getUnlistedPlayerIDs(players: PlayerState[]) {
    const remainingPlayerIDs = this.getRemainingPlayerIDs(players);
    const existingPlayerIDs = this.getExistingPlayerIDs();

    return existingPlayerIDs.filter(
      (id) => remainingPlayerIDs.indexOf(id) === -1
    );
  }

  public playerInstanceExists(playerID: string) {
    return this.getPlayerInstanceByID(playerID) !== undefined;
  }

  private updatePlayerInstance(player: PlayerState) {
    const { id } = player;

    const playerInstance = this.getPlayerInstanceByID(id);
    if (playerInstance) {
      playerInstance.state = player;
      this.node.emit(
        PLAYER_MANAGER_EVENT.PLAYER_INSTANCE_UPDATE,
        playerInstance
      );
    }
  }

  private createPlayerInstance(player: PlayerState) {
    const { id } = player;
    const { playerPrefab, playerGroup } = this;

    if (this.playerInstanceExists(id) || !playerPrefab || !playerGroup) return;

    const node = instantiate(playerPrefab.node);
    node.setParent(playerGroup);
    node.active = true;
    const object = node.getComponent(Player);

    if (object) {
      const playerInstance = {
        state: player,
        object,
      };
      this.setPlayerInstanceByID(id, playerInstance);
      this.node.emit(
        PLAYER_MANAGER_EVENT.PLAYER_INSTANCE_CREATE,
        playerInstance
      );
    } else {
      node.destroy();
    }
  }

  private destroyPlayerInstance(id: string) {
    if (!this.playerInstanceExists(id)) return;

    const playerInstance = this.getPlayerInstanceByID(id);
    this.unsetPlayerInstanceByID(id);
    this.node.emit(
      PLAYER_MANAGER_EVENT.PLAYER_INSTANCE_DESTROY,
      playerInstance
    );
  }

  public getMainPlayer() {
    return this.players.get(this.mainPlayerID);
  }

  public getPlayers() {
    return this.players;
  }
}

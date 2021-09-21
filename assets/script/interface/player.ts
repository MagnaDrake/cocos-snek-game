import { Player } from "../object/player";
import { PlayerState } from "../lib/interface/socket";

export interface PlayerInstance {
  state: PlayerState;
  object: Player;
}
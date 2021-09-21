import { BaseText } from "../lib/text/baseText";

export interface LeaderboardText {
  username?: BaseText;
  score?: BaseText;
  crown?: BaseText;
}

export interface PlayerEndData {
  rank: number;
  points: number;
}
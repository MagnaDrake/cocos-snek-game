export type TPlayerScoreData = {
  rank: number
  points: number
  killedBy?: 'WALL' | 'SNAKE'
  voucherIds?: number[] | null
};

export type TGameState = 'INIT' | 'STARTED' | 'ENDED';

export enum SOCKET {
  MESSAGE_JOIN = 'message_join',
  MESSAGE_STATE = 'message_state',
  MESSAGE_PONG = 'message_pong',
  MESSAGE_GAME_OVER = 'message_game_over',
  ERROR = 'error',
  CLOSED = 'closed',
  OPENED = 'opened',
}

export enum SOCKET_EVENT {
  PING = 1,
	PONG = 2,

  JOIN_ROOM = 20,
	LEFT_ROOM = 21,

	PLAYER_MOVE = 30,

	WORLD_STATE = 40,

  GAME_OVER = 91,
}

export enum SOCKET_GAME_OVER_REASON {
  COLLIDE_WALL = 1001,
  COLLIDE_SNAKE = 1002,
  TIMES_UP = 1003,
}

export enum SOCKET_FOOD_TYPE {
  BASIC = 0,
  VOUCHER = 1,
}

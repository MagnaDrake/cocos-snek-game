export enum ROOM_MANAGER_EVENT {
  JOIN = 'join',
  STATE_UPDATE = 'state_update',
  PONG = 'pong',
  DISCONNECT = 'disconnect',
  EAT = 'eat',
  GAME_OVER = 'game_over',
  
  PLAYER_INSTANCE_CREATE = 'player_instance_create',
  PLAYER_INSTANCE_UPDATE = 'player_instance_update',
  DIE_SFX_PLAYED = 'die_sfx_played',
  RECONNECT = 'reconnect',
  CONNECTION_OPENED = 'opened',
}
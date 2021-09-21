export type TGameConfiguration = {
  food_respawn_delay: number;
  height: number;
  max_food_amount_inside_room: number;
  max_player_per_room: number;
  player_to_foods_conversion_rate: number;
  max_room: number;
  player_velocity: number;
  patch_rate: number;
  snake_body_radius: number;
  food_eaten_per_chicken: number;
  play_time: number;
  points_amount_per_chicken: number;
  points_per_food: number;
  width: number;
  voucher_respawn_delay: number;
  vouchers_per_room: number;
  camera_zoom: number;
  turn_sensitivity: number;
};

export type TLocalGameConfiguration = {};

export type TLocalGameConfigurationKeys = keyof TLocalGameConfiguration;
export type TGameConfigurationKeys = keyof TGameConfiguration;
export type TCombinedGameConfigurationKeys =
  | TLocalGameConfigurationKeys
  | TGameConfigurationKeys;

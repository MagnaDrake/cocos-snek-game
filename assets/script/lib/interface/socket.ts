import { SOCKET_EVENT, SOCKET_FOOD_TYPE, SOCKET_GAME_OVER_REASON } from "../enum/socket";

export interface SocketVector2D {
    x: number;
    y: number;
}

// WebSocket Message Outcoming Data
export interface PlayerMove {
    event: SOCKET_EVENT.PLAYER_MOVE;
    room_id: string;
    player_id: string;
    dir: number;
    vector: SocketVector2D;
}

// WebSocket Message Incoming Data
export interface JoinRoomData {
    event: number;
    foods: FoodState[];
    room_id: string;
    player_id: string;
}

// WebSocket Message Incoming Food Eaten Data
export interface EatenFoodData {
    food_id: number;
    player_id: string;
}

export interface PlayerKillData {
    killer_player_id: string;
    killed_player_id: string;
}

export interface GameOverData {
    cause: SOCKET_GAME_OVER_REASON;
    event: number;
    player_id: string;
    points: number;
    rank: number;
    vouchers: number[]; // Voucher ids
}

export interface KilledInfoData {
    reason: number;
    killed_at: number;
}

export interface PingData {
    event: number;
    timestamp: number;
}

export interface StateData {
    event: number;
    eaten_foods?: EatenFoodData[];
    kills?: PlayerKillData[];
    players: PlayerState[];
    spawned_foods?: FoodState[];
    timestamp: number;
}

export interface PlayerState {
    id: string;
    username: string;
    body: Body;
    velocity: Coordinate;
    points: number;
    end_time: number;
    invulnerable: boolean;
    killed_info?: KilledInfoData;
}

interface Body {
    parts: Coordinate[];
    length: number;
}

interface Coordinate {
    x: number;
    y: number;
}

export interface FoodState {
    id: number;
    position: Coordinate;
    points: number;
    eaten_at?: number;
    type: SOCKET_FOOD_TYPE;
}

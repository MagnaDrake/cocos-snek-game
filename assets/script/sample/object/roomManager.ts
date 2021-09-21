import { _decorator, Component, Vec2, color } from 'cc';
import { SOCKET, SOCKET_EVENT, SOCKET_FOOD_TYPE, SOCKET_GAME_OVER_REASON } from '../lib/enum/socket';
import { WebSocketHandler } from '../lib/socket/webSocketHandler';
import { FoodState, JoinRoomData, PlayerMove, PlayerState, StateData, SocketVector2D, PingData, EatenFoodData, PlayerKillData, GameOverData } from '../lib/interface/socket';
import { ROOM_MANAGER_EVENT } from '../enum/roomManager';
import { PlayerManager } from './playerManager';
import { FoodManager } from './foodManager';
import { TimeManager } from './timeManager';
import { PLAYER_MANAGER_EVENT } from '../enum/playerManager';
import { PlayerInstance } from '../interface/player';
import { MoveData } from '../interface/moveData';
import { SoundEffectManager } from './soundEffectManager';
import { SOUND_MANAGER_EVENT } from '../enum/soundManager';
import { FOOD_EVENT } from '../enum/food';
import { PlayerEndData } from '../interface/leaderboard';
const { ccclass, property } = _decorator;

@ccclass('RoomManager')
export class RoomManager extends Component {
    @property(WebSocketHandler)
    public readonly webSocketHandler?: WebSocketHandler;

    @property(PlayerManager)
    public readonly playerManager?: PlayerManager;

    @property(FoodManager)
    public readonly foodManager?: FoodManager;

    @property(TimeManager)
    public readonly timeManager?: TimeManager;

    @property(SoundEffectManager)
    public readonly soundEffectManager?: SoundEffectManager;

    private roomID = '';

    private moveData?: MoveData;

    private stateStack = new Array<StateData>();

    private processStack = new Array<StateData>();

    private isJoined?: boolean;

    onLoad() {
        this.setupWebSocketListeners();
        this.setupPlayerManagerListeners();
        this.setupSoundManagerListeners();
    }

    start() {
        this.schedule(this.sendPingRequest, 1);
        this.schedule(this.sendMoveRequest, 0.02);
    }

    private setupWebSocketListeners() {
        this.webSocketHandler?.node.on(SOCKET.MESSAGE_JOIN, this.onRoomJoin, this);
        this.webSocketHandler?.node.on(SOCKET.MESSAGE_STATE, this.onRoomStateChange, this);
        this.webSocketHandler?.node.on(SOCKET.MESSAGE_PONG, this.onPong, this);
        this.webSocketHandler?.node.once(SOCKET.MESSAGE_GAME_OVER, this.onGameOver, this);
        this.webSocketHandler?.node.on(SOCKET.CLOSED, this.onRoomDisconnect, this);
        this.webSocketHandler?.node.on(SOCKET.OPENED, this.onConnectionOpened, this);
    }

    private setupPlayerManagerListeners() {
        this.playerManager?.node.on(PLAYER_MANAGER_EVENT.PLAYER_INSTANCE_CREATE, this.onPlayerInstanceCreate, this);
        this.playerManager?.node.on(PLAYER_MANAGER_EVENT.PLAYER_INSTANCE_UPDATE, this.onPlayerInstanceUpdate, this);
    }

    private setupSoundManagerListeners () {
        this.soundEffectManager?.node.on(SOUND_MANAGER_EVENT.DIE_SFX_PLAYED, this.handleDieSfxPlayed, this);
    }

    public connect(username: string, url: string, roomID: string = "", playerID: string = "") {
        this.webSocketHandler?.connect(username, url, roomID, playerID);
    }

    private onRoomJoin(message: JoinRoomData) {
        // Room Join
        const { room_id, player_id, foods } = message;

        this.setIsJoined(true);
        this.setRoomID(room_id);
        this.setMainPlayerID(player_id);
        this.removeExistingFoods();
        this.updateFoods(foods);
        this.node.emit(ROOM_MANAGER_EVENT.JOIN, message);
    }

    private onConnectionOpened() {
        this.node.emit(ROOM_MANAGER_EVENT.CONNECTION_OPENED);
    }

    private onRoomStateChange(state: StateData) {
        // Ignore world_state message if it hasn't joined the room
        if (!this.isJoined) {
            return;
        }
        /**
         * Buffer the state instead of processing it directly.
         * The buffered states will be processed all at once during game's frame update
         */
        this.stateStack.push(state);
    }

    private onPong(pingData: PingData) {
        this.node.emit(ROOM_MANAGER_EVENT.PONG, pingData);
    }

    private handlePlayerKills(kills: PlayerKillData[] = []) {
        kills.forEach(({ killed_player_id }) => {
            console.log('MESSAGE: THIS PLAYER KILLED', { killed_player_id });
        })
    }

    /**
     * TO-DO: change with actual onDeath handler
     */
    private onGameOver({ cause, rank, points, vouchers }: GameOverData) {
        console.log('MESSAGE: PLAYER GAME OVER', { cause, rank, points, vouchers });

        if (cause !== SOCKET_GAME_OVER_REASON.TIMES_UP) {
            this.soundEffectManager?.playDieSfx();
        } else {
            // TO-DO: during this time animate the crash animation
            this.timeManager?.setManualTimeLeft(0);
        }

        const playerEndData: PlayerEndData = {
            rank,
            points,
        }

        this.node.emit(
            ROOM_MANAGER_EVENT.GAME_OVER,
            playerEndData,
            cause,
            vouchers,
        )
    }

    private handleDieSfxPlayed () {
        this.node.emit(ROOM_MANAGER_EVENT.DIE_SFX_PLAYED);
    }

    private onRoomDisconnect() {
        const roomID = this.roomID;
        const playerID = this.playerManager?.getMainPlayerID();
        this.timeManager?.stopTimer();
        this.setIsJoined(false);
        this.node.emit(
            ROOM_MANAGER_EVENT.DISCONNECT,
            roomID,
            playerID,
        );
    }

    private handlePlayerEat (eatenFood: EatenFoodData[] = []) {
        const {
            isBasicFoodExist,
            isMainPlayer,
            isVoucherFoodExist,
        } = eatenFood.reduce((res, data) => {
            const { player_id: messagePlayerID, food_id } = data;
            const mainPlayerID = this.playerManager?.getMainPlayerID();
            const isMainPlayer = messagePlayerID === mainPlayerID;
    
            const foodInstance = this.foodManager?.getFoodInstanceByID(food_id);
            if (!foodInstance) return res;
            
            /** Use food points and type from `foodInstance` */
            const { state: { points, type } } = foodInstance;
            this.removeFood(food_id, messagePlayerID);
            this.node.emit(ROOM_MANAGER_EVENT.EAT, data, isMainPlayer, points, type);

            return {
                isMainPlayer: res.isMainPlayer || isMainPlayer,
                isVoucherFoodExist: res.isVoucherFoodExist || type === SOCKET_FOOD_TYPE.VOUCHER,
                isBasicFoodExist: res.isVoucherFoodExist || type === SOCKET_FOOD_TYPE.BASIC
            };
        }, { isMainPlayer: false, isVoucherFoodExist: false, isBasicFoodExist: false });

        if (isMainPlayer) {
            isBasicFoodExist && this.soundEffectManager?.playEatSfx(SOCKET_FOOD_TYPE.BASIC);
            isVoucherFoodExist && this.soundEffectManager?.playEatSfx(SOCKET_FOOD_TYPE.VOUCHER);
        }
    }

    private handleFoodSpawn (foodSpawn: FoodState[] = []) {
        this.updateFoods(foodSpawn);
    }

    private onPlayerInstanceCreate(playerInstance: PlayerInstance) {
        const isMainPlayer = playerInstance === this.playerManager?.getMainPlayerInstance();
        this.node.emit(ROOM_MANAGER_EVENT.PLAYER_INSTANCE_CREATE, playerInstance, isMainPlayer);
    }

    private onPlayerInstanceUpdate(playerInstance: PlayerInstance) {
        const isMainPlayer = playerInstance === this.playerManager?.getMainPlayerInstance();
        this.node.emit(ROOM_MANAGER_EVENT.PLAYER_INSTANCE_UPDATE, playerInstance, isMainPlayer);
    }

    private setIsJoined(status: boolean) {
        this.isJoined = status;
    }

    private setRoomID(roomID: string) {
        this.roomID = roomID;
    }

    private setMainPlayerID(playerID: string) {
        this.playerManager?.setMainPlayerID(playerID);
    }

    private beginTimer() {
        const timerStatus = this.timeManager?.getTimerStatus();
        if (timerStatus === false) {
            const mainPlayer = this.playerManager?.getMainPlayerInstance();
            this.timeManager?.beginTimer(mainPlayer?.state.end_time);
        }
    }

    private updatePlayers(players: PlayerState[]) {
        this.playerManager?.updatePlayers(players);
    }

    private removeExistingFoods() {
        this.foodManager?.removeExistingFoods();
    }

    private updateFoods(foods: FoodState[]) {
        this.foodManager?.updateFoods(foods);
    }

    private removeFood(foodID: number, playerID: string) {
        const foodInstance = this.foodManager?.getFoodInstanceByID(foodID);
        const playerInstance = this.playerManager?.getPlayerInstanceByID(playerID);

        if (!foodInstance || !playerInstance) return;

        const { object: foodObject } = foodInstance;
        const { object: playerObject } = playerInstance;
        foodObject.suckedTo(playerObject.getHead());
        foodObject.node.once(FOOD_EVENT.SUCKED_TO, () => {
            this.foodManager?.removeFood(foodID);
        });
    }

    private updateTime(timestamp: number) {
        if (!timestamp) return;
        this.timeManager?.setCurrentTime(timestamp);
    }

    /**
     * Move player
     * @param direction Vec2
     * @param magnitude number (speed)
     */
    public setMoveData(direction: Vec2) {
        this.moveData = { direction };
    }

    public leaveRoom() {
        this.sendLeaveRoom();
    }

    private sendMoveRequest() {
        const { roomID, moveData } = this;

        if (!moveData) return;

        const { direction } = moveData;

        const { x, y } = direction;
        const playerID = this.playerManager?.getMainPlayerID();

        this.webSocketHandler?.send(JSON.stringify(
            {
                event: SOCKET_EVENT.PLAYER_MOVE,
                room_id: roomID,
                player_id: playerID,
                vector: { x, y } as SocketVector2D,
            } as PlayerMove
        ));
    }

    private sendPingRequest() {
        this.webSocketHandler?.send(JSON.stringify(
            {
                event: SOCKET_EVENT.PING,
                timestamp: Date.now(),
            }
        ));
    }

    private sendLeaveRoom() {
        this.webSocketHandler?.send(JSON.stringify(
            {
                event: SOCKET_EVENT.LEFT_ROOM,
                timestamp: Date.now(),
            }
        ));
    }

    /**
     * Consolidate the data from the buffered states
     * @param states 
     * @returns 
     */
    private getConsolidatedState(states: Array<StateData>) {
        return states.reduce((res, state) => {
            const {
                eaten_foods,
                kills,
                players,
                spawned_foods,
                timestamp,
            } = state;

            if (eaten_foods) {
                res.eaten_foods?.push(...eaten_foods);
            }

            if (kills) {
                res.kills?.push(...kills);
            }

            if (players) {
                res.players = players;
            }

            if (spawned_foods) {
                res.spawned_foods?.push(...spawned_foods);
            }

            if (timestamp) {
                res.timestamp = timestamp;
            }

            return res;
        }, {
            event: SOCKET_EVENT.WORLD_STATE, 
            eaten_foods: [],
            kills: [],
            players: [],
            spawned_foods: [],
            timestamp: Date.now(),
        } as StateData);
    }

    /**
     * Process the buffered states
     * @returns 
     */
    private processStateStack() {
        if (this.stateStack.length <= 0) return;
        
        this.processStack = this.stateStack;
        this.stateStack = new Array<StateData>();

        const state = this.getConsolidatedState(this.processStack);

        // Room State Change
        const {
            eaten_foods,
            kills,
            players,
            spawned_foods,
            timestamp,
        } = state;

        if (eaten_foods?.length) {
          console.log(
            `%c [EATEN_FOODS msg received] qty: ${
              eaten_foods.length
            }, id(s): ${String(
              eaten_foods.map((food) => food.food_id).join(",")
            )}`,
            `color: green`
          );
        }

        if (spawned_foods?.length) {
          console.log(
            `%c [SPAWNED_FOODS msg received] qty: ${
              spawned_foods.length
            }, id(s): ${String(
              spawned_foods.map((food) => food.id).join(",")
            )}`,
            `color: red`
          );
        }

        this.updatePlayers(players);
        this.updateTime(timestamp);
        this.beginTimer();

        this.handlePlayerKills(kills);
        this.handlePlayerEat(eaten_foods);
        this.handleFoodSpawn(spawned_foods);

        this.node.emit(ROOM_MANAGER_EVENT.STATE_UPDATE, state);
    }

    update() {
        this.processStateStack();
    }
}
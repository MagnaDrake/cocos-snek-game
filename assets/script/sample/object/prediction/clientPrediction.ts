import { _decorator, Component } from 'cc';
import { TGameConfiguration } from '../../interface/gameConfig';
import { calculateAngleBetweenTwoDots, calculateDistanceBetweenTwoDots } from '../../lib/util/algorithm';
import { PlayerState } from "../../lib/interface/socket";
const { ccclass, property } = _decorator;

@ccclass('ClientPrediction')
export class ClientPrediction extends Component {
    private snakeBodyRadius = 25;
    
    private patchRate = 33;

    private playerVelocity = 0;

    private playerMovementPerTick = 0;

    private enablePrediction = true;

    public setupPredictionConfig(config: TGameConfiguration) {
        const {
          player_velocity,
          patch_rate: server_logic_fps,
          snake_body_radius,
          patch_rate,
        } = config;

        this.playerVelocity = player_velocity;
        this.snakeBodyRadius = snake_body_radius;
        this.playerMovementPerTick = player_velocity / server_logic_fps;
        this.patchRate = patch_rate;
    }

    /**
     * Patch the given playerState to reflect the state after the next server update.
     * Used for client prediction.
     * 
     * WARNING: use with caution.
     * @param state 
     * @returns 
     */
    public patchStateWithPrediction(state: PlayerState, delta: number) {
        const head = state?.body?.parts[0];

        if (!head || !this.enablePrediction) return;

        const { playerVelocity, patchRate } = this;
        const { velocity } = state;
        const patchMultiplier = delta / patchRate;

        const movementTargetX = head.x + (playerVelocity * velocity.x);
        const movementTargetY = head.y + (playerVelocity * velocity.y); 

        this.moveHeadPartTowardsTargetFunc(state, movementTargetX, movementTargetY, patchMultiplier);
        this.syncAllBodyPartMovementFunc(state);
    }

    /**
     * Methods below are for the snakes' movement ported directly from the server.
     * They are used for client prediction, and may be refactored in the future.
     */
    private calculateNextMovementPointFunc(x1: number, y1: number, x2: number, y2: number) {
        const { snakeBodyRadius } = this;
        const angle = calculateAngleBetweenTwoDots(x1, y1, x2, y2);
        return {
            x: 2 * snakeBodyRadius * Math.cos(angle),
            y: 2 * snakeBodyRadius * Math.sin(angle),
        };
    }

    private moveHeadPartTowardsTargetFunc(
        state: PlayerState, 
        targetX: number, 
        targetY: number,
        patchMultiplier: number,
    ) {
        const head = state.body.parts[0];

        if (!head) return;

        const { x: headX, y: headY } = head;

        const angle = calculateAngleBetweenTwoDots(targetX, targetY, headX, headY);
        
        const { playerMovementPerTick } = this;
        const nextX = headX + (playerMovementPerTick * Math.cos(angle)) * patchMultiplier;
        const nextY = headY + (playerMovementPerTick * Math.sin(angle)) * patchMultiplier;

        head.x = nextX;
        head.y = nextY;
    }

    private syncAllBodyPartMovementFunc(state: PlayerState) {
        const { snakeBodyRadius } = this;
        const { parts } = state.body;
        for(let idx = 1; idx < parts.length; idx++) {
            const currentPart = parts[idx];
            const previousPart = parts[idx-1];

            if (!currentPart || !previousPart) continue;

            const { x: currentX, y: currentY } = currentPart;
            const { x: previousX, y: previousY } = previousPart;

            const distanceBetweenParts = calculateDistanceBetweenTwoDots(
                currentX,
                currentY,
                previousX,
                previousY,
            );

            if (distanceBetweenParts >= (2 * snakeBodyRadius)) {
                const { x: nextMoveX, y: nextMoveY } = this.calculateNextMovementPointFunc(
                    currentX,
                    currentY, 
                    previousX,
                    previousY,
                );
                currentPart.x = previousX + nextMoveX;
                currentPart.y = previousY + nextMoveY;
            }
        }
    }

    public setEnablePrediction(state: boolean) {
        this.enablePrediction = state;
    }
}
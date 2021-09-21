import { _decorator, Component, Node, UITransform, Size, instantiate, v3, math, UI } from 'cc';
import { FenceCornerSprite } from '../sprite/fenceCornerSprite';
import { FenceExtraSprite } from '../sprite/fenceExtraSprite';
import { FenceSideHorizontalSprite } from '../sprite/fenceSideHorizontalSprite';
import { FenceSideVerticalSprite } from '../sprite/fenceSideVerticalSprite';
import { GameBackgroundSprite } from '../sprite/gameBackgroundSprite';
const { ccclass, property } = _decorator;

type TFenceConfig = {
    position: math.Vec3,
    rotation?: math.Vec3,
};

type TSideConfig = {
    position: math.Vec3,
    height?: number,
    width?: number,
    rotation?: math.Vec3,
    type: 'HORIZONTAL' | 'VERTICAL'
    extra: {
        position: math.Vec3,
        height?: number,
        width?: number,
    }
};

@ccclass('Arena')
export class Arena extends Component {
    @property(GameBackgroundSprite)
    public readonly gameBackgroundSprite?: GameBackgroundSprite;

    @property(FenceSideHorizontalSprite)
    public readonly fenceSideHorizontalSprite?: FenceSideHorizontalSprite;

    @property(FenceSideVerticalSprite)
    public readonly fenceSideVerticalSprite?: FenceSideVerticalSprite;

    @property(FenceCornerSprite)
    public readonly fenceCornerSprite?: FenceCornerSprite;

    @property(FenceExtraSprite)
    public readonly fenceExtraSprite?: FenceExtraSprite;

    private ARENA_WIDTH = 4000;
    private ARENA_HEIGHT = 4000;
    private ARENA_OVERSIZE = 400;
    private MAP_OFFSET = 44.5;

    public setup (width: number, height: number) {
        this.ARENA_WIDTH = width - this.MAP_OFFSET;
        this.ARENA_HEIGHT = height - this.MAP_OFFSET;

        this.setupArenaBackground();
        this.setupFence();

        // TO-DO: refactor this (or not?)
        this.node.setPosition(width * 0.5, height * 0.5);
    }

    private setupArenaBackground () {
        const { gameBackgroundSprite, ARENA_HEIGHT, ARENA_WIDTH, ARENA_OVERSIZE } = this;

        if (!gameBackgroundSprite) return;

        const gameBackgroundUiTransform = gameBackgroundSprite.getComponent(UITransform);

        if (!gameBackgroundUiTransform) return;

        gameBackgroundUiTransform.setContentSize(new Size(ARENA_WIDTH + ARENA_OVERSIZE, ARENA_HEIGHT + ARENA_OVERSIZE));
    }

    private generateSideFence (
        horizontalSprite: FenceSideHorizontalSprite,
        verticalSprite: FenceSideVerticalSprite,
        extraSprite: FenceExtraSprite,
    ) {
        type TSideFenceConfig = [
            TOP: TSideConfig,
            BOTTOM: TSideConfig,
            RIGHT: TSideConfig,
            LEFT: TSideConfig,
        ];

        const { ARENA_HEIGHT, ARENA_WIDTH } = this

        const horizontalUiTransform = horizontalSprite.node.getComponent(UITransform);
        const verticalUiTransform = verticalSprite.node.getComponent(UITransform);
        const extraUiTransform = extraSprite.node.getComponent(UITransform);

        if (!horizontalUiTransform || !verticalUiTransform || !extraUiTransform) return;

        const { height: hHeight } = horizontalUiTransform;
        const { width: vWidth } = verticalUiTransform;
        /** Can use width or height as long as ratio 1 : 1 */
        const { width: extraTileSize } = extraUiTransform;
        /** Extra fence additional width */
        const extraFenceWidth = extraTileSize * 4;
        const extraFenceHeight = extraTileSize * 4;

        const SIDE_FENCE_CONFIG: TSideFenceConfig = [
            {
                position: v3(0, (ARENA_HEIGHT * .5) + (hHeight * .5), 0),
                width: ARENA_WIDTH,
                type: 'HORIZONTAL',
                extra: {
                    position: v3(0, (ARENA_HEIGHT * .5) + (hHeight * .5) + extraTileSize, 0),
                    width: ARENA_WIDTH + extraFenceWidth,
                }
            },
            {
                position: v3(0, (ARENA_HEIGHT * -.5) - (hHeight * .5), 0),
                width: ARENA_WIDTH,
                rotation: v3(180, 0, 0),
                type: 'HORIZONTAL',
                extra: {
                    position: v3(0, (ARENA_HEIGHT * -.5) - (hHeight * .5) - extraTileSize, 0),
                    width: ARENA_WIDTH + extraFenceWidth,
                }
            },
            {
                position: v3((ARENA_WIDTH * .5) + (vWidth * .5), 0, 0),
                height: ARENA_HEIGHT,
                type: 'VERTICAL',
                extra: {
                    position: v3((ARENA_WIDTH * .5) + (vWidth * .5) + extraTileSize, 0, 0),
                    height: ARENA_HEIGHT + extraFenceHeight,
                }
            },
            {
                position: v3(ARENA_WIDTH * -.5 - (vWidth * .5), 0, 0),
                height: ARENA_HEIGHT,
                rotation: v3(0, 180, 0),
                type: 'VERTICAL',
                extra: {
                    position: v3(ARENA_WIDTH * -.5 - (vWidth * .5) - extraTileSize, 0, 0),
                    height: ARENA_HEIGHT + extraFenceHeight,
                }
            }
        ];

        SIDE_FENCE_CONFIG.forEach((config) => {
            const {
                position,
                height,
                rotation,
                width,
                type,
            } = config;

            const node = instantiate((type === 'HORIZONTAL' ? horizontalSprite : verticalSprite).node);
            node.setParent(this.node)
            node.active = true;

            node.setPosition(position);
            if (rotation) {
                node.setRotationFromEuler(rotation);
            }

            const uiTransform = node.getComponent(UITransform)
            if (!uiTransform) return;

            if (height) {
                uiTransform.height = height;
            }
            if (width) {
                uiTransform.width = width;
            }

            this.generateExtraSideFence(config)
        });
    }

    private generateExtraSideFence (config: TSideConfig) {
        const { fenceExtraSprite } = this;

        if (!fenceExtraSprite) return;

        const {
            position,
            height,
            width,
        } = config.extra;

        const node = instantiate(fenceExtraSprite.node);
        node.setParent(this.node);
        node.active = true;

        node.setPosition(position);

        const uiTransform = node.getComponent(UITransform);
        if (!uiTransform) return;

        if (height) {
            uiTransform.height = height;
        }
        if (width) {
            uiTransform.width = width;
        }
    }

    private generateCornerFence (fenceCornerSprite: FenceCornerSprite) {
        type TCornerFenceConfig = [
            TOP_LEFT: TFenceConfig,
            TOP_RIGHT: TFenceConfig,
            BOTTOM_LEFT: TFenceConfig,
            BOTTOM_RIGHT: TFenceConfig,
        ];

        const { ARENA_HEIGHT, ARENA_WIDTH } = this

        const cornerFenceUiTransform = fenceCornerSprite.node.getComponent(UITransform);

        if (!cornerFenceUiTransform) return;

        const { width, height } = cornerFenceUiTransform;

        const CORNER_FENCE_CONFIG: TCornerFenceConfig = [
            {
                position: v3((ARENA_WIDTH * -.5) - (width * .5), (ARENA_HEIGHT * .5) + (height * .5), 0),
                rotation: v3(0, 180, 0),
            },
            {
                position: v3((ARENA_WIDTH * .5) + (width * .5), (ARENA_HEIGHT * .5) + (height * .5), 0),
            },
            {
                position: v3((ARENA_WIDTH * -.5) - (height * .5), (ARENA_HEIGHT * -.5) - (width * .5), 0),
                rotation: v3(180, 180, 0),
            },
            {
                position: v3((ARENA_WIDTH * .5) + (height * .5), (ARENA_HEIGHT * -.5) - (width * .5), 0),
                rotation: v3(180, 0, 0),
            },
        ];

        CORNER_FENCE_CONFIG.forEach(({ position, rotation }) => {
            const node = instantiate(fenceCornerSprite.node);
            node.setParent(this.node)
            node.active = true;

            node.setPosition(position);
            if (rotation) {
                node.setRotationFromEuler(rotation);
            }
        });
    }

    private setupFence () {
        const { fenceCornerSprite, fenceSideHorizontalSprite, fenceSideVerticalSprite, fenceExtraSprite } = this;

        if (!fenceCornerSprite || !fenceSideHorizontalSprite || !fenceSideVerticalSprite || !fenceExtraSprite) return;

        this.generateSideFence(fenceSideHorizontalSprite, fenceSideVerticalSprite, fenceExtraSprite);
        this.generateCornerFence(fenceCornerSprite);
    }

}

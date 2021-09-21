import { _decorator, Component, Node, tween, v3, lerp, instantiate, Sprite, Toggle } from 'cc';
import { GameplayCamera } from '../camera/GameplayCamera';
import { FOOD_EVENT } from '../enum/food';
import { FoodState } from '../lib/interface/socket';
import { GlowEffectSprite } from '../sprite/glowEffectSprite';
import { BaseLabel } from '../lib/text/baseLabel';
const { ccclass, property } = _decorator;

@ccclass('Voucher')
export class Voucher extends Component {
    @property(GlowEffectSprite)
    public readonly glowEffectSprite?: GlowEffectSprite;

    @property({ type: [Node] })
    public readonly spriteList: Array<Node> = [];

    @property(GameplayCamera)
    public readonly gameplayCamera?: GameplayCamera;

    @property(BaseLabel)
    public readonly foodIDText?: BaseLabel;

    @property(Toggle)
    public readonly toggle?: Toggle;

    private glowEffectSpriteRef?: Node;

    private sprite?: Node;

    private textNode?: Node;

    private isShowID: boolean = false;
    

    onLoad () {
        this.addVoucherSprite();
        this.toggle?.node.on('toggle', this.onToggle, this);
    }

    onStateCreate(state: FoodState) {
        if (!state) return;

        this.onStateUpdate(state);
    }

    onStateUpdate(state: FoodState) {
        if (!state) return;

        const { textNode } = this;
        const label = textNode?.getComponent(BaseLabel);
        label?.setText(`${state.id}`);

        const { x, y } = state.position;
        const isRespawning = this.isRespawning(state);

        if (isRespawning) this.despawn();
        else this.spawn();

        this.node.setPosition(x, y);
    }

    onStateDestroy(state: FoodState) {
        // TO-DO: animation magic
    }

    isRespawning(state:FoodState){
        return Boolean(state.eaten_at);
    }

    spawn() {
         // TO-DO: animation magic
        this.node.active = true;
    }

    despawn() {
        // TO-DO: animation magic
        this.node.active = false;
    }

    private setSprite(sprite: Node) {
        this.sprite = sprite;
    }

    private setText(text: Node) {
        this.textNode = text;
    }

    private addVoucherSprite() {
        const voucherNode = this.spawnVoucher();
        const glowEffectNode = this.spawnGlowEffect();
        const text = this.spawnFoodIDText();

        if (voucherNode && glowEffectNode) {
            this.node.addChild(glowEffectNode);
            this.node.addChild(voucherNode);
            this.setGlowEffectSprite(glowEffectNode);
            this.setSprite(voucherNode);
        }

        if (text) {
            this.node.addChild(text);
            this.setText(text);
        }
    }

    private spawnFoodIDText() {
        const { foodIDText } = this;

        if (!foodIDText) return undefined;

        const node = instantiate(foodIDText.node);
        node.active = false;

        return node;
    }

    private spawnVoucher() {
        const voucherSprite = this.getVoucherSprite();

        if (!voucherSprite) return undefined;

        const voucherNode = instantiate(voucherSprite);
        voucherNode.active = false;

        return voucherNode;
    }

    private setGlowEffectSprite(sprite: Node) {
        this.glowEffectSpriteRef = sprite;
    }

    private spawnGlowEffect() {
        const glowEffectNode = instantiate(this.glowEffectSprite?.node);
        
        if (!glowEffectNode) return undefined;

        glowEffectNode.active = false;

        return glowEffectNode;
    }

    private getVoucherSprite(): Node | undefined {
        const { spriteList } = this;
        const voucherSprite = spriteList[0];
        /** It is possible to be `undefined` if the list is empty */
        return voucherSprite;
    }

    /**
     * Player suck food animation
     * @param targetNode Node of the player who eats the food
     */
    public suckedTo(targetNode?: Node) {
        const { node } = this;
        tween(node).to(
            0.2,
            {},
            {
                onUpdate(_, ratio) {
                    if (!ratio || !targetNode?.position) return;

                    const { x: targetX, y: targetY } = targetNode.position;
                    const { x, y } = node.position;
                    node.setPosition(
                        lerp(x, targetX, ratio),
                        lerp(y, targetY, ratio),
                    );
                },
                onComplete() {
                    const { x, y } = node.position;
                    node.emit(FOOD_EVENT.SUCKED_TO, x, y);
                }
            }
        ).start();
    }

    public disableSprite() {
        const { glowEffectSpriteRef, sprite } = this;
        if (glowEffectSpriteRef) {
            glowEffectSpriteRef.active = false;
        }
        if (sprite) {
            sprite.active = false;
        }
    }

    public enableSprite() {
        const { glowEffectSpriteRef, sprite } = this;
        if (glowEffectSpriteRef) {
            glowEffectSpriteRef.active = true;
        }
        if (sprite) {
            sprite.active = true;
        }
    }
    
    public disableText() {
        const { textNode } = this;
        if (!textNode) return;
        textNode.active = false;
    }

    public enableText() {
        const { textNode } = this;
        if (!textNode) return;
        textNode.active = true;
    }

    private onToggle(toggle: Toggle) {
        const { node } = this;
        if (toggle.isChecked) {
            this.isShowID = true;
        }
        else {
            this.isShowID = false;
            this.disableText();
        }
    }

    private updateSpriteVisibility() {
        const { gameplayCamera, node } = this;

        if (gameplayCamera?.isNodeVisibleInCamera(node)) {
            this.enableSprite();
            if (this.isShowID) {
                this.enableText();
            }
        } else {
            this.disableSprite();
            this.disableText();
        }
    }

    update() {
        this.updateSpriteVisibility();
    }
}
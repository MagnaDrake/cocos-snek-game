import { _decorator, Component, Node, CCInteger, instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SpritePool')
export class SpritePool extends Component {
    @property(Node)
    public readonly spritePrefab?: Node;

    @property(CCInteger)
    public readonly initialPoolSize = 0;

    private pool = new Array<Node>();

    onLoad() {
        this.initializePool();
    }

    private initializePool() {
        const { initialPoolSize } = this;
        for (let i = 0; i < initialPoolSize; i++) {
            const sprite = this.createSprite();
            if (sprite) {
                this.returnSprite(sprite);
            }
        }
    }

    public getSprite() {
        const sprite = this.pool.pop() || this.createSprite();
        
        if (!sprite) return undefined;

        sprite.active = true;
        return sprite;
    }

    private createSprite() {
        const { spritePrefab } = this;
        
        if (!spritePrefab) return undefined;

        const sprite = instantiate(spritePrefab);
        
        return sprite;
    }

    public returnSprite(sprite: Node) {
        sprite.active = false;
        sprite.setParent(null);
        this.pool.push(sprite);
    }
}
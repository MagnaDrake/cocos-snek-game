import { _decorator, Component, Node, instantiate } from 'cc';
import { SOCKET_FOOD_TYPE } from '../../lib/enum/socket';
import { Vegetable } from '../vegetable';
import { Voucher } from '../voucher';
const { ccclass, property } = _decorator;

@ccclass('FoodPool')
export class FoodPool extends Component {
    private readonly INITIAL_VEGETABLE_POOL_SIZE = 1000;

    private readonly INITIAL_VOUCHER_POOL_SIZE = 100;

    @property(Vegetable)
    public readonly vegetablePrefab?: Vegetable;

    @property(Voucher)
    public readonly voucherPrefab?: Voucher;

    private vegetablePool = new Array<Node>();

    private voucherPool = new Array<Node>();

    onLoad() {
        this.initializePool();
    }

    private initializePool() {
        const { INITIAL_VEGETABLE_POOL_SIZE, INITIAL_VOUCHER_POOL_SIZE } = this;
        for (let i = 0; i < INITIAL_VEGETABLE_POOL_SIZE; i++) {
            const vegetable = this.createVegetable();
            if (vegetable) {
                this.returnFood(vegetable, SOCKET_FOOD_TYPE.BASIC);
            }
        }
        for (let i = 0; i < INITIAL_VOUCHER_POOL_SIZE; i++) {
            const voucher = this.createVoucher();
            if (voucher) {
                this.returnFood(voucher, SOCKET_FOOD_TYPE.VOUCHER);
            }
        }
    }

    public getVegetable() {
        const vegetable = this.vegetablePool.pop() || this.createVegetable();
        
        if (!vegetable) return undefined;

        vegetable.active = true;
        return vegetable;
    }

    public getVoucher() {
        const voucher = this.voucherPool.pop() || this.createVoucher();
        
        if (!voucher) return undefined;

        voucher.active = true;
        return voucher;
    }


    private createVegetable() {
        const { vegetablePrefab } = this;
        
        if (!vegetablePrefab) return undefined;

        const vegetable = instantiate(vegetablePrefab.node);
        
        return vegetable;
    }

    private createVoucher() {
        const { voucherPrefab } = this;
        
        if (!voucherPrefab) return undefined;

        const voucher = instantiate(voucherPrefab.node);
        
        return voucher;
    }

    public returnFood(food: Node, type: SOCKET_FOOD_TYPE = SOCKET_FOOD_TYPE.BASIC) {
        food.active = false;
        if (type === SOCKET_FOOD_TYPE.VOUCHER) {
            this.voucherPool.push(food);
        }
        else {
            this.vegetablePool.push(food);
        }
    }
}
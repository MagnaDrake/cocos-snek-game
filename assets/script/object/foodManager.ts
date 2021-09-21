import { _decorator, Component, Node, Sprite } from 'cc';
import { FOOD_MANAGER_EVENT } from '../enum/foodManager';
import { FoodInstance } from '../interface/food';
import { FoodState } from '../lib/interface/socket';
import { Vegetable } from './vegetable';
import { FoodPool } from './pool/foodPool';
import { Voucher } from './voucher';
import { SOCKET_FOOD_TYPE } from '../lib/enum/socket';
const { ccclass, property } = _decorator;

@ccclass('FoodManager')
export class FoodManager extends Component {
    @property(FoodPool)
    public readonly foodPool?: FoodPool;

    @property(Node)
    public readonly foodGroup?: Node;

    private foods = new Map<number, FoodInstance>();

    onLoad() {
      this.setupListeners();
    }

    private setupListeners() {
      this.node.on(FOOD_MANAGER_EVENT.FOOD_INSTANCE_CREATE, this.onFoodInstanceCreate, this);
      this.node.on(FOOD_MANAGER_EVENT.FOOD_INSTANCE_UPDATE, this.onFoodInstanceUpdate, this);
      this.node.on(FOOD_MANAGER_EVENT.FOOD_INSTANCE_DESTROY, this.onFoodInstanceDestroy, this);
    }

    private onFoodInstanceCreate(foodInstance: FoodInstance) {
      const { state, object } = foodInstance;
      object.onStateCreate(state);
    }

    private onFoodInstanceUpdate(foodInstance: FoodInstance) {
      const { state, object } = foodInstance;
      object.onStateUpdate(state);
    }

    private onFoodInstanceDestroy(foodInstance: FoodInstance) {
      const { state, object } = foodInstance;
      object.onStateDestroy(state);
      this.foodPool?.returnFood(object.node, state.type);
    }

    public updateFoods(foods: FoodState[]) {
      if (!foods) return;

      foods.forEach(this.onFoodStateUpdate, this);
    }

    private onFoodStateUpdate(food: FoodState) {
      const { id } = food;

      if (this.foodInstanceExists(id)) {
        this.updateFoodInstance(food);
      } else {
        this.createFoodInstance(food);
      }
    }

    public getFoodInstanceByID(foodID: number) {
      return this.foods.get(foodID);
    }

    private setFoodInstanceByID(foodID: number, instance: FoodInstance) {
      this.foods.set(foodID, instance);
    }

    private unsetFoodInstanceByID(foodID: number) {
      this.foods.delete(foodID);
    }

    /**
     * FoodIDs that exist in the client
     * @returns 
     */
    public getExistingFoodIDs() {
      return Array.from(this.foods.keys());
    }

    /**
     * FoodIDs that exist in the server
     * @param foods 
     * @returns 
     */
    public getRemainingFoodIDs(foods: FoodState[]) {
      return foods.map((food) => food.id);
    }

    /**
     * FoodIDs that exist in the client, but does not exist in the server
     * @param foods 
     * @returns 
     */
    public getUnlistedFoodIDs(foods: FoodState[]) {
      const remainingFoodIDs = this.getRemainingFoodIDs(foods);
      const existingFoodIDs = this.getExistingFoodIDs();

      return existingFoodIDs.filter((id) => remainingFoodIDs.indexOf(id) === -1);
    }

    public foodInstanceExists(foodID: number) {
      return this.getFoodInstanceByID(foodID) !== undefined;
    }

    private updateFoodInstance(food: FoodState) {
      const { id } = food;

      const foodInstance = this.getFoodInstanceByID(id);
      if (foodInstance) {
        foodInstance.state = food;
        this.node.emit(FOOD_MANAGER_EVENT.FOOD_INSTANCE_UPDATE, foodInstance);
      }
    }

    private createFoodInstance(food: FoodState) {
      const { id } = food;
      const { foodPool, foodGroup } = this;

      if (this.foodInstanceExists(id) || !foodPool || !foodGroup) return;

      const node = food.type === SOCKET_FOOD_TYPE.VOUCHER ? foodPool.getVoucher() : foodPool.getVegetable();
      const object = food.type === SOCKET_FOOD_TYPE.VOUCHER ? node?.getComponent(Voucher) : node?.getComponent(Vegetable);

      node?.setParent(foodGroup);

      if (object) {
        const foodInstance = {
          state: food,
          object,
        };
        this.setFoodInstanceByID(id, foodInstance);
        this.node.emit(FOOD_MANAGER_EVENT.FOOD_INSTANCE_CREATE, foodInstance);
      } else {
        node?.destroy();
      }
    }

    public removeFood(id: number) {
      if (!this.foodInstanceExists(id)) return;

      const foodInstance = this.getFoodInstanceByID(id);
      this.unsetFoodInstanceByID(id);
      this.node.emit(FOOD_MANAGER_EVENT.FOOD_INSTANCE_DESTROY, foodInstance);
    }

    public getFoodsMap() {
      return this.foods;
    }

    /**
     * Remove all existing foods (used on join to handle ghost foods when reconnecting)
     */
    public removeExistingFoods() {
      this.getExistingFoodIDs().forEach(this.removeFood, this);
    }
}
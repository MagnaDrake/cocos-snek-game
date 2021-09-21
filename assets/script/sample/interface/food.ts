import { FoodState } from "../lib/interface/socket";
import { Vegetable } from "../object/vegetable";
import { Voucher } from "../object/voucher";

export type Food = Vegetable | Voucher;

export interface FoodInstance {
  state: FoodState;
  object: Food;
}
import { _decorator, Component, Node } from "cc";
import { ASSET_KEY } from "../enum/asset";
import { BaseLabel } from "../lib/text/baseLabel";
const { ccclass, property } = _decorator;

@ccclass("Shopee2021BoldLabel")
export class Shopee2021BoldLabel extends BaseLabel {
  constructor() {
    super("Shopee2021BoldLabel", ASSET_KEY.SHOPEE_2021_BOLD);
  }
}

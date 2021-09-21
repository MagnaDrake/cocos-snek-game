import { _decorator, Component, Node } from 'cc';
import { ASSET_KEY } from '../enum/asset';
import { BaseText } from '../lib/text/baseText';
const { ccclass, property } = _decorator;

@ccclass('Shopee2021Medium')
export class Shopee2021Medium extends BaseText {
    constructor() {
        super('Shopee2021Medium', ASSET_KEY.SHOPEE_2021_MEDIUM);
    }
}
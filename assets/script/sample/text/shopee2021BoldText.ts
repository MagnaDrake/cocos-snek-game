import { _decorator } from 'cc';
import { ASSET_KEY } from '../enum/asset';
import { BaseText } from '../../lib/text/baseText';
const { ccclass, property } = _decorator;

@ccclass('Shopee2021BoldText')
export class Shopee2021BoldText extends BaseText {
    constructor() {
        super('Shopee2021BoldText', ASSET_KEY.SHOPEE_2021_BOLD_FONT);
    }
}
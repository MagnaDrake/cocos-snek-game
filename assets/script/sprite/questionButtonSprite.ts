import { _decorator, Component, Node } from 'cc';
import { ASSET_KEY } from '../enum/asset';
import { BaseSprite } from '../lib/sprite/baseSprite';
const { ccclass, property } = _decorator;

@ccclass('QuestionButtonSprite')
export class QuestionButtonSprite extends BaseSprite {
    constructor() {
        super('QuestionButtonSprite', ASSET_KEY.QUESTION_BUTTON_SPRITE);
    }
}
import { _decorator, Component, Node, assetManager, AnimationClip } from 'cc';
import { ANIMATION_KEY } from '../enum/animation';
import { ASSET_KEY } from '../enum/asset';
import { generateAnimationClip } from '../lib/util/animation';
import { BaseSprite } from '../lib/sprite/baseSprite';
const { ccclass, property } = _decorator;

@ccclass('BigChickenRedSprite')
export class BigChickenRedSprite extends BaseSprite {
	private readonly bigChickenRedAnimationKey = ANIMATION_KEY.BIG_CHICKEN_RED;

	constructor() {
		super('BigChickenRedSprite', ASSET_KEY.BIG_CHICKEN_RED_SPRITE, 0);
	}

	onLoad() {
		super.onLoad();
		this.setupAnimation();		
	}
	
	start() {
		this.playBigChickenRedAnimation();
	}

	private setupAnimation() {
		const { bigChickenRedAnimationKey } = this;

		const bigChickenRedAnimationClip = this.getBigChickenRedAnimationClip();

		if (bigChickenRedAnimationClip) {
			this.animation?.createState(bigChickenRedAnimationClip, bigChickenRedAnimationKey);			
		}
	}

	private getBigChickenRedAnimationClip() {
		const { bigChickenRedAnimationKey } = this;

		const animationAsset = assetManager.assets.get(bigChickenRedAnimationKey);

		if (animationAsset) return animationAsset as AnimationClip;
	
		const animationClip = this.generateBigChickenRedAnimationClip();

		if (animationClip) {
			assetManager.assets.add(bigChickenRedAnimationKey, animationClip);
		}

		return animationClip;
	}

	public generateBigChickenRedAnimationClip() {
		const { textureKey } = this;

		const animationClip = generateAnimationClip(
			assetManager, 
			textureKey, 
			[0, 1, 2, 3, 4, 5, 6, 7], 
			16,
			AnimationClip.WrapMode.Loop
		);
		
		return animationClip;
	}

	public playBigChickenRedAnimation() {
		this.animation?.play(this.bigChickenRedAnimationKey);
	}
}

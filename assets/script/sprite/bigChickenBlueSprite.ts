import { _decorator, Component, Node, assetManager, AnimationClip } from 'cc';
import { ANIMATION_KEY } from '../enum/animation';
import { ASSET_KEY } from '../enum/asset';
import { generateAnimationClip } from '../lib/util/animation';
import { BaseSprite } from '../lib/sprite/baseSprite';
const { ccclass, property } = _decorator;

@ccclass('BigChickenBlueSprite')
export class BigChickenBlueSprite extends BaseSprite {
	private readonly bigChickenBlueAnimationKey = ANIMATION_KEY.BIG_CHICKEN_BLUE;

	constructor() {
		super('BigChickenBlueSprite', ASSET_KEY.BIG_CHICKEN_BLUE_SPRITE, 0);
	}

	onLoad() {
		super.onLoad();
		this.setupAnimation();		
	}
	
	start() {
		this.playBigChickenBlueAnimation();
	}

	private setupAnimation() {
		const { bigChickenBlueAnimationKey } = this;

		const bigChickenBlueAnimationClip = this.getBigChickenBlueAnimationClip();

		if (bigChickenBlueAnimationClip) {
			this.animation?.createState(bigChickenBlueAnimationClip, bigChickenBlueAnimationKey);			
		}
	}

	private getBigChickenBlueAnimationClip() {
		const { bigChickenBlueAnimationKey } = this;

		const animationAsset = assetManager.assets.get(bigChickenBlueAnimationKey);

		if (animationAsset) return animationAsset as AnimationClip;
	
		const animationClip = this.generateBigChickenBlueAnimationClip();

		if (animationClip) {
			assetManager.assets.add(bigChickenBlueAnimationKey, animationClip);
		}

		return animationClip;
	}

	public generateBigChickenBlueAnimationClip() {
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

	public playBigChickenBlueAnimation() {
		this.animation?.play(this.bigChickenBlueAnimationKey);
	}
}

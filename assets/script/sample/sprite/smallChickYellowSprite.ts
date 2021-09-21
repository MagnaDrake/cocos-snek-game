import { _decorator, Component, Node, assetManager, AnimationClip } from 'cc';
import { ANIMATION_KEY } from '../enum/animation';
import { ASSET_KEY } from '../enum/asset';
import { generateAnimationClip } from '../lib/util/animation';
import { BaseSprite } from '../lib/sprite/baseSprite';
const { ccclass, property } = _decorator;

@ccclass('SmallChickYellowSprite')
export class SmallChickYellowSprite extends BaseSprite {
	private readonly smallChickYellowAnimationKey = ANIMATION_KEY.SMALL_CHICK_YELLOW;

	constructor() {
		super('SmallChickYellowSprite', ASSET_KEY.SMALL_CHICK_YELLOW_SPRITE, 0);
	}

	onLoad() {
		super.onLoad();
		this.setupAnimation();
		
	}
	
	start() {
		this.playSmallChickYellowAnimation();
	}

	private setupAnimation() {
		const { smallChickYellowAnimationKey } = this;

		const smallChickYellowAnimationClip = this.getSmallChickYellowAnimationClip();

		if (smallChickYellowAnimationClip) {
			this.animation?.createState(smallChickYellowAnimationClip, smallChickYellowAnimationKey);			
		}
	}

	private getSmallChickYellowAnimationClip() {
		const { smallChickYellowAnimationKey } = this;

		const animationAsset = assetManager.assets.get(smallChickYellowAnimationKey);

		if (animationAsset) return animationAsset as AnimationClip;
	
		const animationClip = this.generateSmallChickYellowAnimationClip();

		if (animationClip) {
			assetManager.assets.add(smallChickYellowAnimationKey, animationClip);
		}

		return animationClip;
	}

	public generateSmallChickYellowAnimationClip() {
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

	public playSmallChickYellowAnimation() {
		this.animation?.play(this.smallChickYellowAnimationKey);
	}
}

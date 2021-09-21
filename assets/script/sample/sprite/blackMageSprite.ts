import { AnimationClip, assetManager, _decorator } from 'cc';
import { BaseSprite } from '../../lib/sprite/baseSprite';
import { generateAnimationClip } from '../../lib/util/animation';
import { ANIMATION_KEY } from '../enum/animation';
import { ASSET_KEY } from '../enum/asset';
const { ccclass, property } = _decorator;

@ccclass('BlackMageSprite')
export class BlackMageSprite extends BaseSprite {
    private readonly IDLE_ANIMATION_KEY = ANIMATION_KEY.BLACK_MAGE_IDLE_ANIM;

    constructor() {
        super('BlackMageSprite', ASSET_KEY.BLACK_MAGE_SPRITE, 0);
    }
    
	onLoad() {
		super.onLoad();
		this.setupAnimation();		
	}
	
	start() {
		this.playIdleAnim();
	}

	private setupAnimation() {
		const { IDLE_ANIMATION_KEY } = this;

		const bigChickenBlueAnimationClip = this.getIdleAnimationClip();

		if (bigChickenBlueAnimationClip) {
			this.animation?.createState(bigChickenBlueAnimationClip, IDLE_ANIMATION_KEY);			
		}
	}

	private getIdleAnimationClip() {
		const { IDLE_ANIMATION_KEY } = this;

		const animationAsset = assetManager.assets.get(IDLE_ANIMATION_KEY);

		if (animationAsset) return animationAsset as AnimationClip;
	
		const animationClip = this.generateBigChickenBlueAnimationClip();

		if (animationClip) {
			assetManager.assets.add(IDLE_ANIMATION_KEY, animationClip);
		}

		return animationClip;
	}

	public generateBigChickenBlueAnimationClip() {
		const { textureKey } = this;

		const animationClip = generateAnimationClip(
			assetManager, 
			textureKey, 
			[0, 1, 0], 
			4,
			AnimationClip.WrapMode.Loop
		);
		
		return animationClip;
	}

	public playIdleAnim() {
		this.animation?.play(this.IDLE_ANIMATION_KEY);
	}
}
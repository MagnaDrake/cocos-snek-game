/** Used for strechable image using 9-sliced format */
type AssetStretchableImageOptions = {
  /**
   * Set inset of the bottom side
   */
  insetBottom?: number;
  /**
   * Set inset of the left side
   */
  insetLeft?: number;
  /**
   * Set inset of right side
   */
  insetRight?: number;
  /**
   * Set inset of top side
   */
  insetTop?: number;
}

type AssetSpritesheetOptions = {
  /**
   * Used for spritesheet
   */
  frameWidth?: number;
  /**
   * Used for spritesheet
   */
  frameHeight?: number;
  /**
   * Used for spritesheet
   */
  paddingX?: number;
  /**
   * Used for spritesheet
   */
  paddingY?: number;
}

export type AssetOptions = AssetSpritesheetOptions & AssetStretchableImageOptions
import { Vec2 } from "cc";

/**
 * Checks whether vec2 is on the left (returns +1) or on the right (returns -1) side of vec1
 * @param vec1 
 * @param vec2 
 * @returns +1 or -1
 */
export function getOrientationBetweenVector(vec1: Vec2, vec2: Vec2) {
  const value = vec1.x * vec2.y - vec1.y * vec2.x;
  return Math.sign(value) || 1;
}

export function calculateAngleBetweenTwoDots(x1: number, y1: number, x2: number, y2: number) {
	const deltaX = x1 - x2;
	const deltaY = y1 - y2;
	return Math.atan2(deltaY, deltaX);
}

export function calculateDistanceBetweenTwoDots(x1: number, y1: number, x2: number, y2: number) {
	const deltaX = x1 - x2;
	const deltaY = y1 - y2;
	return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
}
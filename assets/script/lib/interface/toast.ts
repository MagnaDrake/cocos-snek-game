export type TToastOption = {
  duration: number;
  animateInDuration: number;
  animateOutDuration: number;
  animateInEasingFn: (k: number) => number;
  animateOutEasingFn: (k: number) => number;
};

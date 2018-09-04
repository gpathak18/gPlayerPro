import {
  trigger,
  animate,
  style,
  group,
  animateChild,
  query,
  stagger,
  transition
} from "@angular/animations";

export const flipTransition = trigger("flipImage", [
  transition("* => *", [
    style({ transform: "rotate3d(0, 1, 0, 180deg)" }),
    animate("600ms cubic-bezier(0.23, 1, 0.32, 1)")
  ])
]);

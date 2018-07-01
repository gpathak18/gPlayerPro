import { trigger, animate, style, group, animateChild, query, stagger, transition } from '@angular/animations';

export const accordionTransition =
    trigger('flipStateTrigger', [
        transition('true => void', [
            style({ height: '*' }),
            animate('100ms ease-in', style({ height: 0 }))
        ]),
        transition('void => true', [
            style({ height: 0 }),
            animate('200ms', style({ height: '*' }))
        ])
    ])
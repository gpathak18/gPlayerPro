import { trigger, animate, style, group, animateChild, query, stagger, transition } from '@angular/animations';

export const accordionTransition =
    trigger('flipStateTrigger', [
        transition('true => void', [
            style({ transform: 'scaleY(1)' }),
            animate('100ms ease-in', style({ transform: 'scaleY(0)' }))
        ]),
        transition('void => true', [
            style({ transform: 'scaleY(0)' }),
            animate('200ms ease-out', style({ transform: 'scaleY(1)' }))
        ])
    ])
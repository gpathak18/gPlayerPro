import { state, group } from '@angular/animations';
import {
    trigger,
    animate,
    transition,
    style
} from '@angular/animations';

export const fadeAnimation = trigger('fadeAnimation', [
    transition('void => *', [
        style({ opacity: 0 }),
        animate('100ms ease-in', style({ opacity: 1 }))
    ]),
    transition('* => void', [
        style({ opacity: 1 }),
        animate('200ms ease-out', style({ opacity: 0 }))
    ])
])
import { PlaylistService } from './core/services/playlist.service';
import { Router } from '@angular/router';
import { Component, HostBinding } from '@angular/core';
import { DatastoreService } from './core/services/datastore.service';
import { AutoplayService } from './core/services/autoplay.service';
import { transition, trigger, group, query, animate, style } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('routeAnimation', [
      // no need to animate anything on load
      transition(':enter', []),
      // but anytime a route changes let's animate!
      transition('player <=> albums', [
        // Initial state of new route
        query(':enter',
          style({
            position: 'fixed',
            width: '100%',
            transform: 'translateX(-100%)'
          }),
          { optional: true }),

        // move page off screen right on leave
        query(':leave',
          animate('500ms ease',
            style({
              position: 'fixed',
              width: '100%',
              transform: 'translateX(100%)'
            })
          ),
          { optional: true }),

        // move page in screen from left to right
        query(':enter',
          animate('500ms ease',
            style({
              opacity: 1,
              transform: 'translateX(0%)'
            })
          ),
          { optional: true }),
      ])
    ])
  ]
})
export class AppComponent {
  title = 'gPlayerPro';

  constructor(
    private router: Router,
    private playlistService: PlaylistService,
    public datastoreService: DatastoreService,
    private autoplayService: AutoplayService
  ) {

  }

  getState(outlet) {
    return outlet.activatedRouteData['state'] || 'firstPage';
  }

  ngOnInit() {
    this.playlistService.initService();
  }
}

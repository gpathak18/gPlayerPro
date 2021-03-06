import { PlaylistService } from './core/services/playlist.service';
import { Router } from '@angular/router';
import { Component, HostBinding } from '@angular/core';
import { AutoplayService } from './core/services/autoplay.service';
import { transition, trigger, group, query, animate, style } from '@angular/animations';
import { ArtistService } from './core/services/artist.service';
import { DatabaseService } from './core/services/database.service';
import { LibraryResolverService } from './core/services/library-resolver.service';
import { OAuthService, JwksValidationHandler } from 'angular-oauth2-oidc';
import { AuthConfig } from 'angular-oauth2-oidc';
import { FormControl } from '@angular/forms';
import { GapiSession } from 'src/app/gdrive-handler/sessions/gapi.session';
import { AppRepository } from './gdrive-handler/repositories/app.repository';
import { AppSession } from './gdrive-handler/sessions/app.session';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('routeAnimation', [
      // no need to animate anything on load
      transition(':enter', []),
      // but anytime a route changes let's animate!
      transition('* <=> *', [
        // Initial state of new route
        query(':enter',
          style({
            position: 'fixed',
            width: '100%',
            height: '100%',
            // transform: 'translateX(-100%)',
            opacity: 0
          }),
          { optional: true }),

        // move page off screen right on leave
        query(':leave',
          animate('300ms ease-in-out',
            style({
              position: 'fixed',
              width: '100%',
              height: '100%',
              // transform: 'translateX(100%)',
              opacity: 0
            })
          ),
          { optional: true }),

        // move page in screen from left to right
        query(':enter',
          animate('300ms ease-in-out',
            style({
              opacity: 1,
              // transform: 'translateX(0%)'
            })
          ),
          { optional: true }),
      ])
    ])
  ]
})
export class AppComponent {
  title = 'gPlayerPro';
  never = 'never';
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  value = '';
  authConfig: AuthConfig = {
    issuer: 'https://accounts.google.com',
    redirectUri: window.location.origin + '/index.html',
    clientId: '185649967035-jjf098gk9aadcekoqlsv0b2l4ig0pga7.apps.googleusercontent.com',
    scope: 'openid profile email',
    strictDiscoveryDocumentValidation: false
  };

  constructor(
    private libResolver: LibraryResolverService,
    private oauthService: OAuthService,
    private gapiSession: GapiSession,
    private appRepository: AppRepository,
    private appSession: AppSession
  ) {
    this.oauthService.configure(this.authConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.loadDiscoveryDocumentAndTryLogin();

  }

  search($e) {
    this.value = $e.target.value;
  }

  getState(outlet) {
    return outlet.activatedRouteData['state'] || 'firstPage';
  }

  ngAfterViewInit() {
    this.appSession.Gapi.initClient().then((resolved) => {
      this.signIn();
    });
  }

  refresh(fileId: string) {
    this.appRepository.File.getFiles(fileId)
      .then((res) => {
        // this.zone.run(() => {
        console.log(res)
        // });
      });
  }

  signIn() {
    this.appSession.Gapi.signIn()
      .then(() => {
        if (this.appSession.Gapi.isSignedIn) {
          this.refresh("root/music")
        }
      });
  }
}

import {PlaylistService} from '../core/services/playlist.service';
import {DatastoreService} from '../core/services/datastore.service';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-allmusic',
  templateUrl: './allmusic.component.html',
  styleUrls: ['./allmusic.component.css']
})
export class AllmusicComponent implements OnInit {

  constructor( 
    private playlistService: PlaylistService,
    private datastoreService: DatastoreService,  
    private router: Router
  ) { 
      this.router.events.subscribe((event: any) => {
        if (event instanceof NavigationEnd) {
          if(event.urlAfterRedirects === '/allmusic') {
            this.datastoreService.loadTracks(this.playlistService.getMainLibrary().tracks);
          }
        }
      });
    }

  ngOnInit() {

  }

}

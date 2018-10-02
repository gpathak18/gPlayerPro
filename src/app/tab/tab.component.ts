import {Router} from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css']
})
export class TabComponent implements OnInit {

  navLinks:any[];
  activeLinkIndex = 0;

  constructor(private router: Router) { 
    this.navLinks = [
      {label: 'Player', icon: 'play_circle_filled', path: 'player'},
      {label: 'Library', icon: 'music_note',path: 'allmusic'},
      {label: 'Playlists', icon: 'playlist_play',path: 'playlists'},
      {label: 'Albums', icon: 'album',path: 'albums'},
      {label: 'Artists', icon: 'recent_actors',path: 'artists'},
      // {label: 'Radio', icon: 'radio', path: 'radio'},
      {label: 'Settings', icon: 'settings',path: 'settings'},
    ];

  }

  ngOnInit() {
  }

}

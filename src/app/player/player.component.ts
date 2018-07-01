import { PlaylistService } from '../core/services/playlist.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AutoplayService } from '../core/services/autoplay.service';
import { PlayerService } from '../core/services/player.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DatastoreService } from '../core/services/datastore.service';
import { FilehandlingService } from '../core/services/filehandling.service';
import { Track } from '../core/models/track';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { flipTransition } from '../core/animations/flip.animation';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
    animations: [flipTransition]

})
export class PlayerComponent implements OnInit {

  private routerEvtSub: Subscription;
  public imageUrl = 'None'
  public nowPlaying = ''
  public albumName = ''
  private playPauseState = 'pause'
  public autoPlaylist: Array<Track> = new Array();
  private queueLength = 0;
  private maxMenuItems = 100;
  public state = 'active'


  constructor(
    private playlistService: PlaylistService,
    private autoplayService: AutoplayService,
    private datastoreService: DatastoreService,
    private router: Router,
    private playerService: PlayerService,
    private fileHandlingService: FilehandlingService,
    private route: ActivatedRoute,
  ) {

    // route.params.subscribe(val => {
    //   console.log('param constructor')
    // });
    this.routerEvtSub = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if (event.urlAfterRedirects === '/player') {
          this.datastoreService.loadTracks(this.playlistService.getAutoPlaylist());
        }
      }
    });

  }

  ngOnInit() {

    this.autoplayService.autoPlaylistSubject.subscribe((autoPlayQueue) => {

      this.autoPlaylist = autoPlayQueue;
      this.queueLength = this.autoPlaylist.length;

    });

    this.playerService.nowPlaying.subscribe((track: any) => {
      this.imageUrl = track.ImageUrl
      this.nowPlaying = track.Name
      this.albumName = track.Album
      this.toggleState()
    })

  }

  toggleState() {
    this.state = this.state === 'active' ? 'inactive' : 'active';
  }


  public changeListener($event): void {
    this.fileHandlingService.readFiles($event.target.files)
  }

  public stop() {
    this.playerService.pause();
  }

  private playNext() {
    this.playerService.playNext();
  }

  private playPrevious() {
    this.playerService.playPrevious();
  }

  private setPlayPuseIcon() {
    //this.icon = this.playPauseState === 'pause'? 'play_arrow': 'pause';
  }

  private togglePlayPauseState() {
    if (this.playPauseState == 'play') {
      this.playerService.pause();
    } else {
      this.playerService.play();
    }
  }
}

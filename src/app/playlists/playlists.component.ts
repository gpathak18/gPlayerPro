import { DatastoreService } from '../core/services/datastore.service';
import { Track } from '../core/models/track';
import { Playlist } from '../core/models/playlist';
import { PlayerService } from '../core/services/player.service';
import { AutoplayService } from '../core/services/autoplay.service';
import { PlaylistService } from '../core/services/playlist.service';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.css']
})
export class PlaylistsComponent implements OnInit {

  public playLists: Array<Playlist> = new Array();
  private currentTracks: Array<Track>;
  public playlistName: string;
  public playlistname = '';
  public options = false;
  private noimage = 'assets/png/no-image.png';
  private selectedPlaylstId = '';

  constructor(
    private playlistService: PlaylistService,
    private autoplayService: AutoplayService,
    public datastoreService: DatastoreService,
    private router: Router,
    private playerService: PlayerService
  ) {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if (event.urlAfterRedirects === '/playlists') {
          const plylist: any = this.playLists.find((value: any) => value.Name === this.selectedPlaylstId);
          if (plylist) {
            this.datastoreService.loadTracks(plylist.Tracks);

          } else {
            this.datastoreService.loadTracks([]);
          }
        }
      }
    });
  }


  setIconVisibility(event) {
    console.log(event)
  }

  ngOnInit() {

    this.playLists = this.playlistService.userPlaylistsSubject.value;
    if (this.playLists) {
      let firstPlaylist: any = this.playLists[0];
      if (firstPlaylist) {
        let trksInPlylist = firstPlaylist.Tracks
        this.datastoreService.loadTracks(trksInPlylist);
      } else {
        this.datastoreService.loadTracks([]);
      }
    } else {
      this.datastoreService.loadTracks([]);
    }


    this.playlistService.userPlaylistsSubject.subscribe((value) => {
      this.playLists = value
    })

  }

  private loadPlaylists() {
    // this.playlistService.loadUserPlaylists();
    console.log(this.playLists)
  }

  private selectedPlylst($event) {
    const id = $event.currentTarget.id;
    const plylist: any = this.playLists.find((value: any) => value.Name === id);
    this.datastoreService.loadTracks(plylist.Tracks);
    this.selectedPlaylstId = id;
    console.log(id);
  }

  public addPlaylist($event) {
    if (this.playlistname != null && this.playlistname.length > 0) {
      const plylst = new Playlist(this.playlistname);
      this.playlistService.createPlaylist(plylst);
      this.playlistname = "";
    }
  }

  private deletePlaylist($event) {
    this.playlistService.deletePlaylist($event.target.id);
  }

  private playPlaylist($event) {
    const id = $event.currentTarget.id;
    const plylist: any = this.playLists.find((value: any) => value.Name === id);
    this.autoplayService.updateAutoPlaylist(plylist.Tracks.slice(0))
    this.playerService.playNow(this.autoplayService.getTrackToPlay());
  }

  private playTrack(track) {
    this.playerService.playNow(track);
  }
}

import { Track } from "../core/models/track";
import { Playlist } from "../core/models/playlist";
import { PlayerService } from "../core/services/player.service";
import { AutoplayService } from "../core/services/autoplay.service";
import { PlaylistService } from "../core/services/playlist.service";
import { Component, OnInit, NgZone } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";

@Component({
  selector: "app-playlists",
  templateUrl: "./playlists.component.html",
  styleUrls: ["./playlists.component.scss"]
})
export class PlaylistsComponent implements OnInit {
  public playLists = new Array();
  public currentTracks = new Array();
  public playlistName: string;
  public playlistname = "";
  public options = false;
  private noimage = "assets/png/no-image.png";
  private selectedPlaylstId = "";
  private selectedTrack;
  constructor(
    private playlistService: PlaylistService,
    private autoplayService: AutoplayService,
    private router: Router,
    private playerService: PlayerService,
    private zone: NgZone
  ) {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if (event.urlAfterRedirects === "/playlists") {
 
        }
      }
    });
  }

  setIconVisibility(event) {
    console.log(event);
  }

  ngOnInit() {
    this.playlistService.getAllPlaylists().subscribe(playlists => {
      this.zone.run(() => {
        this.playLists = playlists;
      });
    });

    // if (this.playLists) {
    //   let firstPlaylist: any = this.playLists[0];
    //   if (firstPlaylist) {
    //     let trksInPlylist = firstPlaylist.Tracks
    //     this.datastoreService.loadTracks(trksInPlylist);
    //   } else {
    //     this.datastoreService.loadTracks([]);
    //   }
    // } else {
    //   this.datastoreService.loadTracks([]);
    // }

    // this.playlistService.userPlaylistsSubject.subscribe((value) => {
    //   this.playLists = value
    // })
  }

  private loadPlaylists() {
    // this.playlistService.loadUserPlaylists();
    console.log(this.playLists);
  }

  public selectedPlylst($event) {
    const id = $event.currentTarget.id;
    const plylist: any = this.playLists.find((value: any) => value._id === id);
    this.playlistService
      .getTracksOfPlaylist(plylist)
      .then((tracks: any) => {
        this.zone.run(() => {
          this.currentTracks = tracks;
          this.selectedPlaylstId = id;
        });
      })
      .catch(error => {
        this.currentTracks = [];
        console.log(error);
      });
  }

  public addPlaylist($event) {
    if (this.playlistname != null && this.playlistname.length > 0) {
      this.playlistService.createPlaylist(this.playlistname);
      this.playlistname = "";
    }
  }

  private deletePlaylist($event) {
    const id = $event.currentTarget.id;
    const plylist: any = this.playLists.find((value: any) => value._id === id);
    this.playlistService.deletePlaylist(plylist);
    this.currentTracks = [];
  }

  private playPlaylist($event) {
    const id = $event.currentTarget.id;
    const plylist: any = this.playLists.find((value: any) => value.Name === id);
    this.autoplayService.updateAutoPlaylist(plylist.Tracks.slice(0));
    this.playerService.playNow(this.autoplayService.getTrackToPlay());
  }

  private playTrack(track) {
    this.playerService.playNow(track);
  }
  clickRowIndex = -1
  setSelectedTrack(track,i) {
    this.selectedTrack = track;
    this.clickRowIndex = i;
  }

}

import { PlayerService } from '../core/services/player.service';
import { Playlist } from '../core/models/playlist';
import { Track } from '../core/models/track';
import { DatastoreService } from '../core/services/datastore.service';
import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, ElementRef, HostListener } from '@angular/core';
import { PlaylistService } from '../core/services/playlist.service';
import { AutoplayService } from '../core/services/autoplay.service';
import { FilehandlingService } from '../core/services/filehandling.service';
import { MatSnackBar } from '@angular/material';
declare const window: any;
const { shell } = window.require("electron").remote

@Component({
  selector: 'app-tableview',
  templateUrl: './tableview.component.html',
  styleUrls: ['./tableview.component.css']
})
export class TableviewComponent implements OnInit {

  @Input('isDisplayImage') isDisplayImage = false;
  // @Input('selectedRowIndex') selectedRowIndex = -1;
  // @Output() playEvent = new EventEmitter();

  public displayedColumns = ['Position', 'Name', 'Options'];

  private noimage = 'assets/no-image.png';
  private tracks: Array<Track>;
  public userPlaylists: Array<Playlist>;
  private selectedTrack: any;
  private nowPlayingTrackId: string;
  public stars: Array<string> = ['star_border', 'star_border', 'star_border', 'star_border', 'star_border']

  private play_circle_icon = 'play_circle_outline';
  private starResetCntr = 0;
  private shiftKeyFirstIndex = -1;
  private clickRowIndex = -1

  private emptyQueue = false;
  private isSelectAll = false;
  private isCheckAll = false;
  private isShowDropZone = true;
  private isPaused = false;

  // datastoreService: DatastoreService;

  constructor(
    private changeDetectorRefs: ChangeDetectorRef,
    private playlistService: PlaylistService,
    private autoPlayService: AutoplayService,
    public datastoreService: DatastoreService,
    private playerService: PlayerService,
    private fileHandlingSerice: FilehandlingService,
    public snackBar: MatSnackBar,
  ) {

  }

  private setSelection(track) {
    console.log(track.Selection)
  }


  ngOnInit() {

    // this.changeDetectorRefs.detectChanges();
    // this.datastoreService = new DatastoreService();
    // this.datastoreService.loadTracks(this.playlistService.getMainLibrary().tracks)
    // this.datastoreService.libTableData.subscribe(addedTracks => {

    // this.tracks = addedTracks;
    // console.log('inside table', this.tracks)
    // if (this.tracks && this.tracks.length <= 0) {
    //   this.isShowDropZone = true;
    // } else {
    //   this.isShowDropZone = false;
    // }
    // });

    this.playerService.nowPlaying.subscribe((track: any) => {
      this.nowPlayingTrackId = track._Id;
      // this.clickRowIndex = track.Position;
    });

    this.playerService.playPause.subscribe((state: any) => {
      this.isPaused = state === 'pause' ? true : false;
      // this.clickRowIndex = track.Position;
    });

    this.playlistService.userPlaylistsSubject.subscribe(value => this.userPlaylists = value);

  }

  ngOnDestroy() {
    // this.datastoreService.libTableData.unsubscribe();
    // this.playerService.nowPlaying.unsubscribe();
    // this.playerService.playPause.unsubscribe();
  }

  private handleRowClick(row, event) {
    this.clickRowIndex = row.Position;
    this.isSelectAll = false;
    if (event.shiftKey) {
      this.tracks.map((track: any) => {
        if (this.shiftKeyFirstIndex < row.Position) {
          if (track.Position >= this.shiftKeyFirstIndex && track.Position <= row.Position) {
            track.Selection = true;
          }
        } else {
          if (track.Position <= this.shiftKeyFirstIndex && track.Position >= row.Position) {
            track.Selection = true;
          }
        }
      });
    } else {
      // this.tracks.map((track:any) => track.Selection = false);
    }
    this.shiftKeyFirstIndex = row.Position;
  }

  private playTrack(row) {
    this.isPaused = false;
    if (this.nowPlayingTrackId != '' && this.nowPlayingTrackId === row._Id) {
      this.playerService.play();
    } else {
      this.playerService.playNow(row)
      this.nowPlayingTrackId = row._Id;
    }
  }

  public menuCloseEvent() {
    //this.playlistService.updateMainLibrary(this.tracks);
  }

  private handleDrop(e) {
    let files: File = e.dataTransfer.files;
    this.fileHandlingSerice.readFiles(files);
    return false;
  }

  private onFilesChange(fileList: FileList) {
    console.log(fileList);
  }

  private setCheckAll(_isCheckAll) {
    this.isCheckAll = _isCheckAll;
    this.tracks.map((track: any) => track.Selection = _isCheckAll);
    // this.playlistService.updateMainLibrary(this.tracks); 
  }

  private setRating(i) {
    this.stars = this.stars.map((star, index) => {
      if (index <= i) {
        star = 'star'
      } else {
        star = 'star_border'
      }
      this.selectedTrack.Rating = i;
      return star;
    });
  }

  private resetRating(i) {
    if (i === 0 && this.starResetCntr === 1) {
      this.stars[i] = this.stars[i] === 'star_border' ? 'star' : 'star_border';
      if (this.stars[0] === 'star') {
        this.selectedTrack.Rating = 1;
      } else {
        this.selectedTrack.Rating = -1;
      }
      this.starResetCntr = 0;
    } else if (i === 0) {
      this.starResetCntr++;
    }
  }

  private openSnackBar(plslst: Playlist, action: string) {

    const theTrack = new Track(this.selectedTrack.Name);
    theTrack.trackNumber = this.selectedTrack.TrackNumber;
    theTrack.link = this.selectedTrack.Link;
    theTrack.source = this.selectedTrack.Source;
    theTrack.year = this.selectedTrack.Year
    theTrack.album = this.selectedTrack.Album
    theTrack.artist = this.selectedTrack.Artist;
    theTrack.id = this.selectedTrack._Id
    theTrack.image = this.selectedTrack.ImageUrl;


    this.playlistService.addToPlaylist(theTrack, plslst).then((result) => {
      this.showConfirmMessage('Track Added');
    }).catch((error) => {
      console.log('error', error);
      this.showConfirmMessage('Could not add track');
    });
  }

  private showConfirmMessage(msg) {
    this.snackBar.open(msg, 'Done', {
      duration: 1000,
    });
  }

  public openInFinder() {
    if (!shell.showItemInFolder(this.selectedTrack.Link)) {
      this.showConfirmMessage('Could not open track in finder.');
    }
  }

  public enqueueTrack() {
    this.autoPlayService.addToQueue(this.selectedTrack);
    this.emptyQueue = false;
  }

  public enqueuePlayNext() {
    this.autoPlayService.addPlayNext(this.selectedTrack);
  }

  public moveToTrash() {
    if (shell.moveItemToTrash(this.selectedTrack.Link)) {
      this.showConfirmMessage('Track deleted.');
    } else {
      this.showConfirmMessage('Could not delete track.');
    }
    const _mainLibrary = this.playlistService.deleteFromMainLibrary(this.selectedTrack)
    this.datastoreService.loadTracks(_mainLibrary.tracks);
  }

  private setSelectedTrack(_track) {
    this.selectedTrack = _track;
    this.setRating(_track.Rating);
  }

  private pauseTrack() {
    this.isPaused = true;
    this.playerService.pause();
  }

  @HostListener('document:keydown', ['$event'])
  private handleKeyboardEvent(event: KeyboardEvent) {
    if (event.metaKey && event.keyCode == 65) {
      this.isSelectAll = true;
    }
  }

  trackByFn(index, item) {
    return item.Position = index; 
  }

  @ViewChild('filter') filter: ElementRef;

}

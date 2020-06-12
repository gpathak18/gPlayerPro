import { PlayerService } from "../core/services/player.service";
import { Playlist } from "../core/models/playlist";
import { Track } from "../core/models/track";
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  HostListener,
  NgZone
} from "@angular/core";
import { PlaylistService } from "../core/services/playlist.service";
import { AutoplayService } from "../core/services/autoplay.service";
import { FilehandlingService } from "../core/services/filehandling.service";
import { MatSnackBar, MatMenuTrigger, MatPaginator } from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";
import { DatastoreService } from "./datastore.service";
import { tap } from "rxjs/internal/operators/tap";
declare const window: any;
const { shell } = window.require("electron").remote;

@Component({
  selector: "app-tableview",
  templateUrl: "./tableview.component.html",
  styleUrls: ["./tableview.component.scss"],
  providers: [DatastoreService]
})
export class TableviewComponent implements OnInit {
  @Input("isDisplayImage")
  isDisplayImage = true;
  @ViewChild(MatMenuTrigger)
  trigger: MatMenuTrigger;
  @ViewChild("table")
  table;

  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  // @Input("page")
  page = 0;
  length = 120;
  pageSize = 60;
  lastIndex = 0;

  // @Input('selectedRowIndex') selectedRowIndex = -1;
  // @Output() playEvent = new EventEmitter();

  public displayedColumns = [
    "Position",
    "Select",
    "Name",
    "Album",
    "Time",
    "Year",
    "Rating"
  ];

  public symbol_cross = "&#10008;";
  public symbol_check = "&#10004;";
  public symbol_select = this.symbol_check;
  public symbol_star = "&#9733;";

  public selection = new SelectionModel(true, []);

  private noimage = "assets/no-image.png";
  private tracks: Array<Track>;
  public userPlaylists: Array<Playlist>;
  private selectedTrack: any;
  private nowPlayingTrackId: string;
  public stars: Array<string> = [
    "star_border",
    "star_border",
    "star_border",
    "star_border",
    "star_border"
  ];

  private play_circle_icon = "play_circle_outline";
  private starResetCntr = 0;
  private shiftKeyFirstIndex = -1;
  private clickRowIndex = -1;

  private emptyQueue = false;
  private isSelectAll = false;
  private isCheckAll = false;
  private isShowDropZone = true;
  private isPaused = false;

  private db;

  public menuLeft = 0;
  public menuTop = 0;

  library = new Array();

  constructor(
    private autoPlayService: AutoplayService,
    public datastoreService: DatastoreService,
    private playerService: PlayerService,
    private fileHandlingSerice: FilehandlingService,
    public snackBar: MatSnackBar,
    private playlistService: PlaylistService,
    private zone: NgZone
  ) {}

  private setSelection(track) {
    console.log(track.Selection);
  }

  ngOnInit() {

    this.datastoreService.renderPage(0);
   

    if (this.tracks && this.tracks.length <= 0) {
      this.isShowDropZone = true;
    } else {
      this.isShowDropZone = false;
    }

    this.playerService.nowPlaying.subscribe((track: any) => {
      this.nowPlayingTrackId = track.id;
      // this.clickRowIndex = track.Position;
    });

    this.playerService.playPause.subscribe((state: any) => {
      this.isPaused = state === "pause" ? true : false;
      // this.clickRowIndex = track.Position;
    });

    this.playlistService.getAllPlaylists().subscribe(playlists => {
      this.zone.run(() => {
        this.userPlaylists = playlists;
      });
    });
  }

  ngAfterViewInit() {
    this.paginator.page.pipe(tap(() => this.loadPage())).subscribe();
  }

  loadPage() {
    this.lastIndex = this.paginator.pageIndex * 60;
    this.datastoreService.renderPage(this.paginator.pageIndex);
  }

  public onTableScroll(e) {}

  public isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.datastoreService.totalTracks;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  public masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.datastoreService.data().forEach(row => this.selection.select(row));
  }

  private handleRowClick(row, event) {
    this.setSelectedTrack(row);
    this.clickRowIndex = row.Position;
    this.isSelectAll = false;
    if (event.shiftKey) {
      this.tracks.map((track: any) => {
        if (this.shiftKeyFirstIndex < row.Position) {
          if (
            track.Position >= this.shiftKeyFirstIndex &&
            track.Position <= row.Position
          ) {
            track.Selection = true;
          }
        } else {
          if (
            track.Position <= this.shiftKeyFirstIndex &&
            track.Position >= row.Position
          ) {
            track.Selection = true;
          }
        }
      });
    } else {
      // this.tracks.map((track:any) => track.Selection = false);
    }
    this.shiftKeyFirstIndex = row.Position;
  }

  public onRightClick(row, e) {
    this.handleRowClick(row, e);
    this.setRating(row.Rating);
    event.preventDefault();
    this.menuLeft = e.x;
    this.menuTop = e.y - 100;
    this.trigger.openMenu();
  }

  public playTrack(row) {
    this.isPaused = false;
    if (this.nowPlayingTrackId && this.nowPlayingTrackId === row.id) {
      this.playerService.play();
    } else {
      this.playerService.playNow(row);
      this.nowPlayingTrackId = row.id;
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
    this.tracks.map((track: any) => (track.Selection = _isCheckAll));
    // this.playlistService.updateMainLibrary(this.tracks);
  }

  private  setRating(i) {
    if (!i) {
      i = 0;
    }
    this.stars = this.stars.map((star, index) => {
      if (index < i) {
        star = "star";
      } else {
        star = "star_border";
      }
      this.selectedTrack.atomicSet('Rating',i + "");
      // this.selectedTrack.Rating = i + "";
      return star;
    });
  }

  private resetRating(i) {
    if (i === 1 && this.starResetCntr === 1) {
      this.stars[0] = this.stars[0] === "star_border" ? "star" : "star_border";
      if (this.stars[0] === "star") {
        // this.selectedTrack.Rating = "" + 1;
        this.selectedTrack.atomicSet('Rating',1 + "");
      } else {
        // this.selectedTrack.Rating = "" + 0;
        this.selectedTrack.atomicSet('Rating',0 + "");
      }
      this.starResetCntr = 0;
    } else if (i === 1) {
      this.starResetCntr++;
    }
    // this.selectedTrack.save();
  
  }

  private openSnackBar(plylist, action: string) {
    this.playlistService
      .addToPlaylist(plylist, this.selectedTrack._id)
      .then(result => {
        this.showConfirmMessage("Track Added");
      })
      .catch(error => {
        this.showConfirmMessage("Could not add track.");
      });
  }

  private showConfirmMessage(msg) {
    this.snackBar.open(msg, "Done", {
      duration: 1000
    });
  }

  public openInFinder() {
    if (!shell.showItemInFolder(this.selectedTrack.Link)) {
      this.showConfirmMessage("Could not open track in finder.");
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
      this.showConfirmMessage("Track deleted.");
    } else {
      this.showConfirmMessage("Could not delete track.");
    }
    // const _mainLibrary = this.playlistService.deleteFromMainLibrary(this.selectedTrack)
    // this.datastoreService.loadTracks(_mainLibrary.tracks);
  }

  public setSelectedTrack(_track) {
    this.selectedTrack = _track;
  }

  private pauseTrack() {
    this.isPaused = true;
    this.playerService.pause();
  }

  @HostListener("document:keydown", ["$event"])
  private handleKeyboardEvent(event: KeyboardEvent) {
    if (event.metaKey && event.keyCode == 65) {
      this.isSelectAll = true;
    }
  }

  trackByFn(index, item) {
    item.Position = index;
    return item._id;
  }

  @ViewChild("filter")
  filter: ElementRef;
}

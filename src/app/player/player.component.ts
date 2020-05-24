import { PlaylistService } from "../core/services/playlist.service";
import { Subscription, Observable } from "rxjs";
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet
} from "@angular/router";
import { AutoplayService } from "../core/services/autoplay.service";
import { PlayerService } from "../core/services/player.service";
import {
  AfterViewInit,
  Component,
  OnInit,
  ElementRef,
  ViewChild
} from "@angular/core";
import { FilehandlingService } from "../core/services/filehandling.service";
import { Track } from "../core/models/track";
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";
import { flipTransition } from "../core/animations/flip.animation";
import { DatabaseService } from "../core/services/database.service";
import { FormControl } from "@angular/forms";
import {
  MatChipInputEvent,
  MatAutocompleteSelectedEvent
} from "@angular/material";
import { startWith, map } from "rxjs/operators";
import { ChartService } from "../core/services/chart.service";
import { AppRepository } from "src/app/gdrive-handler/repositories/app.repository";
import { AppSession } from "src/app/gdrive-handler/sessions/app.session";

@Component({
  selector: "app-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.scss"],
  animations: [flipTransition]
})
export class PlayerComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  never = 'never';
  addOnBlur = false;
  separatorKeysCodes: number[] = [13, 188];
  genereCtrl = new FormControl();
  filteredGenere: Observable<string[]>;
  generes: string[] = [];
  allGenere: string[] = [
    "HipHop",
    "EDM",
    "Trance",
    "House",
    "Progressive House",
    "Rock",
    "Hard Rock"
  ];
  @ViewChild("fruitInput", {static: false}) genereInput: ElementRef;

  @ViewChild('artistPanel', {static: false}) panel: ElementRef<any>;

  filepath = "";
  private routerEvtSub: Subscription;
  public imageUrl = "None";
  public nowPlaying = "";
  public albumName = "";
  private playPauseState = "pause";
  public autoPlaylist: Array<Track> = new Array();
  private queueLength = 0;
  private maxMenuItems = 100;
  public state = "active";
  public song: any = "../../../assets/song.mp3";

  public atrists = new Array();
  public weeklyTopTracks = new Array();

  constructor(
    private playlistService: PlaylistService,
    private autoplayService: AutoplayService,
    private router: Router,
    private playerService: PlayerService,
    private route: ActivatedRoute,
    private databaseService: DatabaseService,
    private chartService: ChartService,
    private appRepository: AppRepository,
    private appSession: AppSession
  ) {

    this.filteredGenere = this.genereCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.allGenere.slice()));

  }

  async ngOnInit() {

    const db: any = await this.databaseService.get();
    db.track
      .find()
      .limit(10)
      .exec()
      .then(tracks => {
        this.autoPlaylist = tracks;
      });

    this.autoplayService.autoPlaylistSubject.subscribe(autoPlayQueue => {
      this.autoPlaylist = autoPlayQueue;
      this.queueLength = this.autoPlaylist.length;
    });

    this.playerService.nowPlaying.subscribe((track: any) => {
      this.imageUrl = track.ImageUrl;
      this.nowPlaying = track.Name;
      this.albumName = track.Album;
      this.toggleState();
    });

    this.routerEvtSub = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if (event.urlAfterRedirects === "/player") {

        }
      }
    });

    this.getChart();
    // this.signIn()

  }

  public getChart() {

    this.chartService.getTopArtists().subscribe((data: any) => {
      this.atrists = data.artists.artist;
      console.log(this.atrists[0].image[0]['#text'])
    });

    this.chartService.getWeeklyTopTen().subscribe((data: any) => {
      this.weeklyTopTracks = data.tracks.track;
      console.log(this.weeklyTopTracks)
    });

    this.chartService.getSimilarTracks().subscribe((data: any) => {
      console.log(data)
    });
  }



  public onPreviousSearchPosition() {
    this.panel.nativeElement.scrollLeft -= (this.panel.nativeElement.clientWidth);
  }

  public onNextSearchPosition() {
    this.panel.nativeElement.scrollLeft += (this.panel.nativeElement.clientWidth);
  }

  public add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || "").trim()) {
      this.generes.push(value.trim());
    }
    if (input) {
      input.value = "";
    }
    this.genereCtrl.setValue(null);
  }

  public remove(val: string): void {
    const index = this.generes.indexOf(val);

    if (index >= 0) {
      this.generes.splice(index, 1);
    }
  }

  public selected(event: MatAutocompleteSelectedEvent): void {
    this.generes.push(event.option.viewValue);
    this.genereInput.nativeElement.value = "";
    this.genereCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allGenere.filter(
      genere => genere.toLowerCase().indexOf(filterValue) === 0
    );
  }

  public toggleState() {
    this.state = this.state === "active" ? "inactive" : "active";
  }

  public stop() {
    this.playerService.pause();
  }

  private playNext() {
    this.playerService.playNext();
  }

  private playTrack(track) {
    this.playerService.playNow(track);
  }
  
  private playPrevious() {
    this.playerService.playPrevious();
  }

  private togglePlayPauseState() {
    if (this.playPauseState == "play") {
      this.playerService.pause();
    } else {
      this.playerService.play();
    }
  }
}

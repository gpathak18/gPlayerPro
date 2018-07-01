import { PlaylistService } from '../core/services/playlist.service';
import { DatastoreService } from '../core/services/datastore.service';
import { Album } from '../core/models/album';
import { animate, transition, style, state, trigger } from '@angular/animations';
import { Component, OnInit, HostListener, ViewChild, ElementRef, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { from } from 'rxjs';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
import { Track } from '../core/models/track';
import { UiService } from '../core/services/ui.service';
import { accordionTransition } from '../core/animations/accordion.animation';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css'],
  animations: [
    accordionTransition
  ]
})
export class AlbumsComponent implements OnInit {

  public imageUrl = 'None'
  private noimage = 'assets/no-image.png';
  public albums: Array<Album> = new Array();
  private isFlipped = 'false';
  private zAnimate = 'zClose';
  private thisstyle = '';

  private isPositionO = false;
  private currentTracks: Array<Track>;
  private selectedAlbum
  private albDetHgt = '0px'

  constructor(
    private playlistService: PlaylistService,
    private datastoreService: DatastoreService,
    private router: Router,
    private uiService: UiService,
    private cdRef: ChangeDetectorRef
  ) {

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if (event.urlAfterRedirects === '/albums') {
          this.datastoreService.loadTracks(this.playlistService.getMainLibrary().tracks);
          this.isFlipped = 'false';
        }
      }
    });

  }


  ngOnInit() {


    this.datastoreService.connect().subscribe(addedTracks => {

      if (addedTracks) {
        this.albums = [];
        const source = from(addedTracks);

        const albumsObs = source.pipe(
          groupBy((track: any) => track.Album),
          mergeMap(group => group.pipe(toArray()))
        );


        albumsObs.subscribe(albumTrkArr => {
          let album = new Album(albumTrkArr[0].Album);
          album.imageUrl = albumTrkArr[0].ImageUrl;
          album.tracks = albumTrkArr;
          album.selection = 'close';
          album.indexz = 'zClose';
          this.albums.push(album);
        });
      }

    });

    // this.uiService.albumDetailDivHeight.subscribe((height: string) => {
    //   if (this.albDetHgt) {
    //     this.albDetHgt = height
    //     console.log('hei', this.albDetHgt)
    //   }
    // })

  }


  // @ViewChildren('albumTracks') trackMatList: QueryList<any>;

  ngAfterViewInit() {
    // this.trackMatList.changes.subscribe(t => {
    //   if (this.albDtlView) {
    //     this.uiService.albumDetailDivHeight.next(this.albDtlView.nativeElement.offsetHeight + 'px')
    //   }
    // })
  }

  // ngAfterViewChecked() {
  //   this.cdRef.detectChanges();
  // }

  private onClick(e, album) {
    this.albDetHgt = '0px'
    album.selection = album.selection == "open" ? "close" : "open";
    if (this.selectedAlbum && this.selectedAlbum !== album) {
      this.selectedAlbum.selection = 'close'
    }
    this.isFlipped = album.selection == "open" ? 'true' : 'false';
    this.currentTracks = album.Tracks;
    this.selectedAlbum = album;

  }

  private flippingStarted(ev, album) {
    // this.y = ev.element.offsetHeight+'px'

    // if (ev.element.clientHeight < 400) {
    //   album.indexz = "zOpen"
    // }

    // if (album.Selection === 'open') {
    //   this.isPositionO = true;
    // }

  }

  private flippingDone(ev, album) {

    // if (ev.element.clientHeight < 400) {
    //   album.indexz = "zClose"
    // }

    // if (album.Selection === 'close') {
    //   this.isPositionO = false;
    // }

  }

}

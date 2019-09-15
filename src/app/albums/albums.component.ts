import { Component, AfterViewInit, NgZone, HostListener } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Track } from '../core/models/track';
import { accordionTransition } from '../core/animations/accordion.animation';
import { DatabaseService } from '../core/services/database.service';
import { AlbumResolverService } from '../core/services/album-resolver.service';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css'],
  animations: [
    accordionTransition
  ]
})
export class AlbumsComponent implements AfterViewInit {

  public imageUrl = 'None'
  private noimage = 'assets/no-image.png';
  public albums: Array<any> = new Array();
  private isFlipped = 'false';
  private currentTracks: Array<Track>;
  private selectedAlbum
  private albDetHgt = '0px'

  constructor(
    private albumResolverService: AlbumResolverService,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone
  ) {

  }


  ngOnInit() {

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if (event.urlAfterRedirects === '/albums') {
          this.isFlipped = 'false';
        }
      }
    });

  }

  ngAfterViewInit() {
    this.albumResolverService.albumsSubjectObservable.subscribe((albums: any) => {
        this.zone.run(() => {
          this.albums = albums;
        })
    })
  }

  private async onClick(e, album) {

    this.albumResolverService.getAlbumTracks(album).then((tracks: any) => {
      this.currentTracks = tracks;
    });

    // this.albDetHgt = '0px'
    // album.Selection = album.Selection == "open" ? "close" : "open";
    let selection = album.Selection == "open" ? "close" : "open";
    await album.atomicSet('Selection',selection);
    if (this.selectedAlbum && this.selectedAlbum !== album) {
      await  this.selectedAlbum.atomicSet('Selection','close');
      // this.selectedAlbum.Selection = 'close'
    }
    this.isFlipped = album.Selection == "open" ? 'true' : 'false';
    this.selectedAlbum = album;

  }

  private flippingStarted(ev, album) {

  }

  private flippingDone(ev, album) {

  }

  @HostListener('scroll', ['$event'])
  scrollHandler(event) {
    console.debug("Scroll Event");
  }

}

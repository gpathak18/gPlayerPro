import { Component, OnInit, NgZone } from '@angular/core';
import { ArtistService } from '../core/services/artist.service';

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.css']
})
export class ArtistsComponent implements OnInit {

  public artists = new Array();
  public artistAlbums = new Array();
  public selectedArtistName = "";
  public selectedArtist;
  public selectedArtistId;
  public totalSelArtistAlbums = 0;
  public totalSelArtistTracks = 0;


  constructor(private artistService: ArtistService, private zone: NgZone) { }

  ngOnInit() {

    this.artistService.getAllArtists().then((query$) => {
      query$.subscribe((artists: any) => {
        artists.sort()
        artists.sort((a, b) => {
          var x = a.ArtistName.toLowerCase();
          var y = b.ArtistName.toLowerCase();
          if (x < y) {return -1;}
          if (x > y) {return 1;}
          return 0;
      });
        this.zone.run(() => {
          this.artists = artists;
        })
      })
    }) 

  }

  public async flattenArtist($event) {
    const id = $event.currentTarget.id;
    this.selectedArtistId = id;
    this.selectedArtist = this.artists.find((value: any) => value._id === id);
    this.selectedArtistName = this.selectedArtist.ArtistName;
    this.artistAlbums = this.selectedArtist.Albums;
    this.totalSelArtistAlbums = this.artistAlbums.length;
    this.artistService.setCurrentArtist(this.selectedArtist.ArtistName)
    // this.totalSelArtistTracks = this.selectedArtist.Albums.Tracks.length;
  }

}

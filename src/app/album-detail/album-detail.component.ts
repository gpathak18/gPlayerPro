import { Component, OnInit, Input, NgZone } from '@angular/core';
import { ArtistService } from '../core/services/artist.service';
import { DatabaseService } from '../core/services/database.service';

@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.scss']
})
export class AlbumDetailComponent implements OnInit {

  @Input() album: any
  public imageUrl = 'None'
  public tracks = new Array();
  public noimage = 'assets/no-image.png';
  public AlbumImage

  constructor(
    private artistService: ArtistService, 
    private dbService: DatabaseService,
    private zone: NgZone
  ) { 
  }

  ngOnInit() {

    this.artistService.getAlbumTracks(this.album.Tracks).then((tracks$)=>{
      tracks$.subscribe((tracks) => {
        this.zone.run(() => {
          this.tracks = tracks;
          if(tracks) {
            this.AlbumImage = tracks[0].Image;
          }
        })
      })
    }).catch((e)=> {
      console.log(e)
    })

  }

}

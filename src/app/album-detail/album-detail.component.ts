import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.scss']
})
export class AlbumDetailComponent implements OnInit {

  @Input() album: any
  currentTracks
  public imageUrl = 'None'
  private noimage = 'assets/no-image.png';
  albums = new Array();

  constructor() { 

  }

  ngOnInit() {

    console.log('really 4')
   
  }

}

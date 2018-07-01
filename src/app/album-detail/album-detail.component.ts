import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.css']
})
export class AlbumDetailComponent implements OnInit {

  @Input() album: any

  public imageUrl = 'None'
  private noimage = 'assets/no-image.png';

  constructor() { }

  ngOnInit() {
  }

}

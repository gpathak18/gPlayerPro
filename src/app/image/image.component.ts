import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {
  
  @Input('imageUrl') imageUrl;
  private noimage = 'assets/no-image.png';

  constructor() { }

  ngOnInit() {
  }

}

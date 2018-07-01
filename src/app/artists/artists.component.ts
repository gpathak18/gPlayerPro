import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.css']
})
export class ArtistsComponent implements OnInit {

  artists = [
    {name: 'A.R. Rehman', icon: 'account_box'},
    {name: 'Michael Jackson', icon: 'equalizer'},
    {name: 'Coldplay', icon: 'radio'},
    {name: 'Hardwell', icon: 'color_lens'},
    {name: 'Armin Wan Burren', icon: 'cloud'},

  ]

  constructor() { }

  ngOnInit() {
  }

  

}

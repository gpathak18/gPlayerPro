import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  public selectedSettingId;

  settings = [
    {name: 'Account', icon: 'account_box'},
    {name: 'Equalizer', icon: 'equalizer'},
    {name: 'Player', icon: 'radio'},
    {name: 'Theme', icon: 'color_lens'},
    {name: 'Cloud', icon: 'cloud'},

  ]

  constructor( private router: Router) { 
    // this.router.events.subscribe((event: any) => {
    //   if (event instanceof NavigationEnd) {
    //     if (event.urlAfterRedirects === '/settings') {
          
    //     }
    //   }
    // });
  }

  ngOnInit() {
  }

  onSettingClick($event) {
    this.selectedSettingId = $event.currentTarget.id;
  }


}

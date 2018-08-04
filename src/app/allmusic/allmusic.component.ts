import { PlaylistService } from '../core/services/playlist.service';
import { DatastoreService } from '../core/services/datastore.service';
import { Component, OnInit, NgZone, AfterViewInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DatabaseService } from '../core/services/database.service';
import { RxDocument } from 'rxdb';
import { accordionTransition } from '../core/animations/accordion.animation';

@Component({
  selector: 'app-allmusic',
  templateUrl: './allmusic.component.html',
  styleUrls: ['./allmusic.component.css']
})
export class AllmusicComponent implements AfterViewInit {

  constructor() {

  }

  ngOnInit() {
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {
   
  }


}

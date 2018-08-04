import { Observable, merge } from 'rxjs';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { map } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material';
import { Track } from '../models/track';
import { PlaylistService } from './playlist.service';
import { AutoplayService } from './autoplay.service';
import { PlayerService } from './player.service';
import { FilehandlingService } from './filehandling.service';
import { RxDocument } from 'rxdb';

@Injectable({
  providedIn: 'root'
})
export class DatastoreService extends DataSource<Track> {

  private trackSubject: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([]);

  constructor() {
    super()
  }

  connect(): Observable<Track[]> {
    return this.trackSubject.asObservable();
  }

  disconnect(): void {
    this.trackSubject.complete();
  }

  loadTrackPage(tracks: Array<Track>, filter: string,
    sortDirection: string, pageIndex: number, pageSize: number) {
    this.loadTracks(tracks);
  }

  async loadTracks(tracks) {
    this.trackSubject.next(tracks);
  }

}

import { Injectable } from '@angular/core';
import { FilehandlingService } from './filehandling.service';
import { PlayerService } from './player.service';
import { AutoplayService } from './autoplay.service';
import { DatastoreService } from './datastore.service';
import { PlaylistService } from './playlist.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  private playlists = new BehaviorSubject([]);

  constructor(
    private fileHandlingService: FilehandlingService,
    private playerService: PlayerService,
    private autoplayService: AutoplayService,
    private datastoreService: DatastoreService,
    private playlistService: PlaylistService
  ) { }




}

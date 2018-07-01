import { DatastoreService } from './datastore.service';
import { Injectable } from '@angular/core';
import { PouchDbService } from './pouch-db.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { AutoplayService } from './autoplay.service';
import { FilehandlingService } from './filehandling.service';
import { Playlist } from '../models/playlist';
import { Track } from '../models/track';


@Injectable({
  providedIn: 'root',
})
export class PlaylistService {

  private mainLibrary: Playlist;
  private autoPlaylist: Array<Track> = new Array();

  private isInstantiated: boolean;

  public playlists: Array<Playlist> = new Array();
  public userPlaylistsSubject = new BehaviorSubject([]);

  constructor(
    private dbservice: PouchDbService,
    private datastore: DatastoreService,
    private autoPlayService: AutoplayService,
    private fileHandler: FilehandlingService
  ) {

    this.fileHandler.tracks.subscribe((tracks) => {

      tracks.map((track: any) => {
        this.mainLibrary.tracks.push(track)
      })

      this.dbservice.put(this.mainLibrary, 'MAIN_LIBRARY');
      if (this.autoPlayService.autoPlaylistSubject.value) {
        this.datastore.loadTracks(this.mainLibrary.tracks);
      } else {
        this.mainLibrary.tracks.map((o, i) => { if (i < 10) this.autoPlaylist.push(o) });
        this.datastore.loadTracks(this.autoPlaylist);
        this.autoPlayService.updateAutoPlaylist(this.autoPlaylist)
      }

    });

    this.userPlaylistsSubject.subscribe((value) => {
      console.log('ply subject', value)
    })
  }

  public initService() {
    //Load Main Library
    if (!this.isInstantiated) {
      this.loadMainlibrary().then((result) => {
        this.mainLibrary = new Playlist('MAIN_LIBRARY');
        this.mainLibrary.tracks = this.mainLibrary.tracks.concat(result.Tracks);
        this.mainLibrary.trackCount = result.TrackCount;
        console.log(this.mainLibrary.tracks)
        if (this.mainLibrary.tracks) {
          console.log('inside', result.Tracks)
          this.mainLibrary.tracks.map((o, i) => { if (i < 10) this.autoPlaylist.push(o) });
          this.datastore.loadTracks(this.autoPlaylist);
          this.autoPlayService.updateAutoPlaylist(this.autoPlaylist)
        }

      }).catch((error) => {
        console.log('Error: Main Library: ', error);
      });
      this.loadUserPlaylists();
    }
  }

  public loadUserPlaylists() {
    this.getAllPlaylists().then((result) => {
      const rows = result.rows;
      for (const row of rows) {
        if (row.doc.language !== 'query' && row.doc.Name !== 'MAIN_LIBRARY') {
          this.playlists.push(row.doc);
        }
      }
      this.userPlaylistsSubject.next(this.playlists);
    }).catch((error) => {
      console.log('Error: User Playlist: ', error);
    });
  }

  public loadMainlibrary(): Promise<any> {

    return new Promise((resolve, reject) => {
      this.dbservice.get('MAIN_LIBRARY').catch((err) => {

        if (err.status === 404) {
          const mainLibrary = this.initMainLibrary();
          this.dbservice.put(mainLibrary, 'MAIN_LIBRARY');
          return mainLibrary;
        } else {
          throw err;
        }
      }).then((_mainLibrary) => {
        resolve(_mainLibrary);
      }).catch((err) => {
        reject(err);
      });
    });

  }

  public initMainLibrary(): Playlist {
    const mainLibrary: Playlist = new Playlist('MAIN_LIBRARY');
    mainLibrary.trackCount = 0;
    mainLibrary.isHidden = true;
    mainLibrary.userIsOwner = true;
    mainLibrary.tracks = Array<Track>();
    return mainLibrary;
  }

  public getAllPlaylists(): Promise<any> {
    return new Promise((resolve, reject) => {

      this.dbservice.fetchAll().then((playlists) => {
        resolve(playlists);
      }).catch((err) => {
        reject(err);
      });

    });
  }

  public getMainLibrary(): Playlist {
    return this.mainLibrary;
  }

  public getAutoPlaylist() {
    return this.autoPlaylist;
  }

  public updateMainLibrary(tracks) {
    this.mainLibrary.tracks = tracks;
    this.dbservice.put(this.mainLibrary, 'MAIN_LIBRARY');
    return this.mainLibrary;
  }

  public deleteFromMainLibrary(track: any) {
    this.mainLibrary.tracks = this.mainLibrary.tracks.filter((value: any) => value._Id !== track._Id);
    this.dbservice.put(this.mainLibrary, 'MAIN_LIBRARY');
    return this.mainLibrary;
  }

  public createPlaylist(plyLst: Playlist) {
    this.dbservice.put(plyLst).then((result) => {
      if (result.ok) {
        this.playlists.push(plyLst);
        this.userPlaylistsSubject.next(this.playlists);
      }
    }).catch((error) => {
      console.log('Error', error);
    });
  }

  public deletePlaylist(plyLst_id: string) {
    this.dbservice.delete(plyLst_id).then((result) => {
      this.playlists = this.playlists.filter((value: any) => value.Name !== plyLst_id);
      this.userPlaylistsSubject.next(this.playlists);
    }).catch((error) => {
      console.log(error);
    });
  }

  public addToPlaylist(track: any, plylst?: any): Promise<any> {
    plylst.Tracks.push(track);
    return this.dbservice.put(plylst);
  }

  public deleteFromPlaylist(track: Track) {

  }

}

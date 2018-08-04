import { Injectable, NgZone } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DatabaseService } from './database.service';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlbumResolverService implements Resolve<any> {

  private albumTrackCache = new Map();
  public albums: Array<any> = new Array();
  private albumSubject = new Subject();
  public albumsSubjectObservable = this.albumSubject.asObservable();

  constructor(
    private databaseService: DatabaseService
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.renderAlbums();
  }

  async renderAlbums() {
    const db: any = await this.databaseService.get();
    const albums$ = db.album.find().$;
    albums$.subscribe(albumDocs => {
      if (albumDocs) {
        this.buildTrackCache(albumDocs)
        this.albumSubject.next(albumDocs)
      }
    });
  }

  async buildTrackCache(albumDocs) {
    albumDocs.map((album) => {
      if (album) {
        this.albumTrackCache.set(album.AlbumName, album.Tracks_)
      }
    })
  }

  async renderTracksOfAlbum(album) {
    const tracks = album.Tracks_;
    await tracks.then((tracks) => {
      return tracks
    }).catch((e) => {
      throw new Error(e)
    })
  }

  getAlbumTracks(album) {
    const cachePromise = this.albumTrackCache.get(album.AlbumName)
    if (cachePromise) {
      return cachePromise
    } else {
      return album.Tracks_
    }
  }

}

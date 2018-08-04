import { Injectable } from '@angular/core';
import RxDB from 'rxdb';
import { QueryChangeDetector, RxJsonSchema } from 'rxdb';
import { RxDatabase } from 'rxdb/src/typings/rx-database';
// import { TrackSchema, AlbumSchema, PlaylistSchema, ArtistSchema } from './core/schemas/schemas.export';
import TrackSchema from "../../core/schemas/track.schema.json";
import AlbumSchema from "../../core/schemas/album.schema.json";
import PlaylistSchema from "../../core/schemas/playlist.schema.json";
import ArtistSchema from "../../core/schemas/artist.schema.json";
import PouchdbAdapterIdb from 'pouchdb-adapter-idb'; 

// const trackSchema: any  = TrackSchema
// const albumSchema: any  = AlbumSchema
// const playlistSchema: any  = PlaylistSchema
// const artistSchema: any  = ArtistSchema

RxDB.plugin(PouchdbAdapterIdb);
RxDB.QueryChangeDetector.enable();
RxDB.QueryChangeDetector.enableDebugging();

let collections = [
  {
    name: 'track',
    schema: TrackSchema
  }, 
  {
    name: 'album',
    schema: AlbumSchema
  },
  {
    name: 'playlist',
    schema: PlaylistSchema
  },
  {
    name: 'artist',
    schema: ArtistSchema
  }
];

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  static dbPromise: Promise<RxDatabase> = null;

  private async create(): Promise<RxDatabase> {

    console.log('DatabaseService: creating database..');

    const db: any = await RxDB.create({
      name: 'gplayer',
      adapter: 'idb',
      // password: 'myLongAndStupidPassword' // no password needed
      multiInstance: true
    });
    console.log('DatabaseService: created database');
    window['db'] = db; // write to window for debugging
    // show leadership in title
    db.waitForLeadership()
      .then(() => {
        console.log('isLeader now');
        document.title = '♛ ' + document.title;
      });

    // create collections
    console.log('DatabaseService: create collections');
    await Promise.all(collections.map((colData:any) => db.collection(colData)));

    // hooks
    console.log('DatabaseService: add hooks');

    await db.track.postInsert(async (track) => {

    
    });

    console.log('finally')


    // sync
    // console.log('DatabaseService: sync');
    // collections
    //   .filter(col => col.sync)
    //   .map(col => col.name)
    //   .forEach(colName => db[colName].sync({ remote: syncURL + colName + '/' }));

    return db;
  }

  get(): Promise<RxDatabase> {

    if (DatabaseService.dbPromise) {
      return DatabaseService.dbPromise;
    }

    // create database
    DatabaseService.dbPromise = this.create();
    return DatabaseService.dbPromise;
  }
}

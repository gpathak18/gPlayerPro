import { Injectable } from "@angular/core";
import { PouchDbService } from "./pouch-db.service";
import { BehaviorSubject, Observable } from "rxjs";
import { Subject } from "rxjs";
import { AutoplayService } from "./autoplay.service";
import { FilehandlingService } from "./filehandling.service";
import { Playlist } from "../models/playlist";
import { Track } from "../models/track";
import { DatabaseService } from "./database.service";

@Injectable({
  providedIn: "root"
})
export class PlaylistService {
  private mainLibrary: Playlist;
  private autoPlaylist: Array<Track> = new Array();
  public playlists: Array<Playlist> = new Array();
  public $playlistQuery;
  public userPlaylistsSubject = new BehaviorSubject([]);
  private db;

  constructor(private dbservice: DatabaseService) {
    this.userPlaylistsSubject.subscribe(value => {
      console.log("ply subject", value);
    });
    this.initDatabase();
  }

  async initDatabase() {
    this.db = await this.dbservice.get();
  }

  public getAllPlaylists() {
     return this.db.playlist.find().$;
  }

  public getAutoPlaylist() {
    return this.autoPlaylist;
  }

  public async createPlaylist(playlistName) {
    const db: any = await this.dbservice.get();
    let playlistDoc = db.playlist.newDocument({});

    playlistDoc.DocType = "playlist";
    playlistDoc.PlaylistName = playlistName;
    playlistDoc.Tracks = new Array();;
    playlistDoc.save().catch(error => {
      throw new Error(error);
    });
  }

  public deletePlaylist(plyLstDoc) {
    plyLstDoc.remove();
  }

  public async addToPlaylist(plylistDoc,trackId) {
    
    if (plylistDoc) {
      let trackArr = plylistDoc.Tracks.slice(0)
      trackArr.push(trackId)
      plylistDoc.Tracks = trackArr
      plylistDoc.save();
    } 
    
  }

  public async getTracksOfPlaylist(playlist) {
    const tracks = await playlist.Tracks_;
    return tracks
  }

  public deleteFromPlaylist(track: Track) {

    
  }
}

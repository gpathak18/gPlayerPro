import { Injectable } from "@angular/core";
import { DatabaseService } from "./database.service";
import { Subject } from "rxjs/internal/Subject";

@Injectable({
  providedIn: "root"
})
export class ArtistService {

  public artists: Array<any> = new Array();
  public currentArtist;

  constructor(private dbService: DatabaseService) {
    this.getAllArtists();
  }

  public async getAllArtists() {
    const db: any = await this.dbService.get();
    const albums$ = db.artist.find().$;
    return albums$;
  }

  public async getAlbumTracks(trackIds) {
    const db: any = await this.dbService.get();
    const tracks$ = db.track.find({
      '_id': { $in: trackIds }
    }).$
    return tracks$;
  }

  public setCurrentArtist(artist) {
    this.currentArtist = artist;
  }

  public async getAlbumTracksByArtist() {
    const db: any = await this.dbService.get();
    const tracks$ = db.track.find().where('ArtistName').eq(this.currentArtist).$
    return tracks$;
  }
  
}

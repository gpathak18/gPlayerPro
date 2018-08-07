import { Observable, merge } from "rxjs";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { DataSource, CollectionViewer } from "@angular/cdk/collections";
import { map } from "rxjs/operators";
import { MatTableDataSource } from "@angular/material";
import { Track } from "../models/track";
import { PlaylistService } from "./playlist.service";
import { AutoplayService } from "./autoplay.service";
import { PlayerService } from "./player.service";
import { FilehandlingService } from "./filehandling.service";
import { RxDocument } from "rxdb";
import { DatabaseService } from "./database.service";

@Injectable({
  providedIn: "root"
})
export class DatastoreService extends DataSource<Track> {
  private trackSubject: BehaviorSubject<Array<any>> = new BehaviorSubject<
    Array<any>
  >([]);
  public query;
  public db;
  public totalTracks = 0;
  private library = new Array();
  limit = 50;
  skip = 0;

  constructor(private databaseService: DatabaseService) {
    super();
    
  }

  connect(): Observable<Track[]> {
    return this.trackSubject.asObservable();
  }

  disconnect(): void {
    this.trackSubject.complete();
  }

  async renderTable(limit, skip) {
    this.limit = limit;
    this.skip = skip;
    const db: any = await this.databaseService.get();
    this.query = db.track
      .find()
      .limit(this.limit)
      .skip(this.skip);
    return this.query.$;
  }

  async buildTableCache(tracks) {
    this.library = this.library.concat(tracks);
  }

  executeQuery(limit,skip){
    this.limit = limit;
    this.skip = skip;
    this.query.exec();
  }

  loadTrackPage(
    tracks: Array<Track>,
    filter: string,
    sortDirection: string,
    pageIndex: number,
    pageSize: number
  ) {
    this.loadTracks(tracks);
  }

  async loadTracks(tracks) {
    this.library = tracks;
    this.totalTracks = tracks.length;
    this.trackSubject.next(tracks);
  }

  data() {
    return this.library;
  }
}

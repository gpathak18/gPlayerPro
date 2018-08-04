import { Injectable, NgZone } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { Observable } from "rxjs";
import { DatabaseService } from "./database.service";
import { DatastoreService } from "./datastore.service";
import { DOCUMENT } from "@angular/common";

@Injectable({
  providedIn: "root"
})
export class LibraryResolverService implements Resolve<any> {
  private libCache = new Map();
  private library = new Array();
  private skipCount = 0;
  private limitCount = 100;

  constructor(
    private databaseService: DatabaseService,
    private datastoreService: DatastoreService,
    private zone: NgZone
  ) {
    this.subscribe();
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    this.skipCount = 0;
    this.library = [];
    // return this.renderTable();
    return this.renderTable();
  }

  async subscribe() {
    const db: any = await this.databaseService.get();
    const tracks$ = db.track.$;
    tracks$.subscribe(tracks => {
      this.library = this.library.concat(tracks.data.v);
      this.updateTableView();
    });
    this.renderTable();
  }

  async renderTable() {
    const db: any = await this.databaseService.get();
    db.track
      .find()
      .limit(this.limitCount)
      .skip(this.skipCount)
      .exec()
      .then(tracks => {
        this.library = this.library.concat(tracks);
        this.skipCount = this.skipCount + this.limitCount;
        this.updateTableView();
      });

    // const query$ = db.track.find().$
    // query$.subscribe((tracks) => {
    //   this.library = this.library.concat(tracks);
    //   this.skipCount = this.skipCount + this.limitCount
    //   this.updateTableView()
    // });
  }

  async updateTableView() {
    this.zone.run(() => {
      this.datastoreService.loadTracks(this.library);
    });
  }
}

import { Observable } from "rxjs";
import { Injectable, NgZone } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { DataSource } from "@angular/cdk/collections";
import { Track } from "../core/models/track";
import { DataService } from "../core/services/data.service";

@Injectable()
export class DatastoreService extends DataSource<Track> {
  
  private trackSubject: BehaviorSubject<Array<any>> = new BehaviorSubject<
    Array<any>
  >([]);

  public totalTracks = 0;
  private library = new Array();


  constructor(private dataService: DataService, private zone: NgZone) {
    super();
  }

  connect(): Observable<Track[]> {
    return this.trackSubject.asObservable();
  }

  disconnect(): void {
    this.trackSubject.complete();
  }

  renderPage(page) {
    this.dataService.renderPage(page).then((tracks: any) => {
      this.library = tracks;
      this.zone.run(() => {
        this.loadTracks(this.library);
      });
    });
  }

  async loadTracks(tracks) {
    this.trackSubject.next(tracks);
  }

  data() {
    return this.library;
  }
}

import { Injectable } from "@angular/core";
import { Track } from "../models/track";
import { DatabaseService } from "./database.service";

@Injectable({
  providedIn: "root"
})
export class DataService {
  public options = {
    limit: 61,
    page: 0,
    startKey: ''
  };

  private pageRequest = [];
  private pageKeyMap = new Map();
  private pageProcessed = 0;

  constructor(private databaseService: DatabaseService) {}

  // initLibraryView() {
  //   return this.getPageData(this.options.startKey).then(tracks => {
  //     if (tracks && tracks.length > 0) {
  //       let lastDoc = tracks[tracks.length - 1];
  //       this.options.startKey = lastDoc._id;

  //       this.pageKeyMap.set(this.options.page++, this.options.startKey);

  //       this.pageProcessed++;

  //       if (this.pageProcessed < 4) {
  //         this.initLibraryView();
  //       }
  //     }

  //     return tracks;
  //   });
  // }

  async renderPage(page) {
    let tracks = await this.getPageData(++page);
    console.log(this, this.pageKeyMap);
    return tracks;
  }

  async getPageData(page) {

    if (this.pageKeyMap.get(page)) {
      this.options.startKey = this.pageKeyMap.get(page);
    }

    let queryOption = {}
    
    if(page===1) {
      queryOption =   { $gte:  this.options.startKey }
    } else {
      queryOption =   { $gt:  this.options.startKey }
    }
    
  
    const db: any = await this.databaseService.get();

    return db.track
      .find({ _id: queryOption })
      .limit(this.options.limit)
      .exec()
      .then(tracks => {
        if (tracks && tracks.length > 0) {
          let lastDoc = tracks[tracks.length - 1];
          if(page === 1 && !this.pageKeyMap.get(page)) {
            let firstDoc = tracks[0]
            this.pageKeyMap.set(page, firstDoc._id);
          }
          this.options.startKey = lastDoc._id;
          this.pageKeyMap.set(++page, this.options.startKey);
        }
        return tracks;
      });
  }


}

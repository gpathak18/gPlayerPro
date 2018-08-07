import { Injectable } from "@angular/core";
import jsmediatags from "jsmediatags/dist/jsmediatags";
import { DatabaseService } from "./database.service";
import { Observable } from "rxjs";
declare const window: any;
const fs = window.require("fs");

@Injectable({
  providedIn: "root"
})
export class FilehandlingService {
  private fileType = "audio.*";
  private db;
  private albumTracksMap = new Map();
  private artistAlbumMap = new Map();

  private fileCount = 0;
  private processedTracks = 0;

  private albumSize = 0;
  private processedAlbumCnt = 0;

  private progress$: Observable<number>;
  private progressObserver: any;
  private progress: number = 0;
  private imgCacheMap = new Map();

  constructor(private dbService: DatabaseService) {
    this.progress$ = new Observable(observer => {
      this.progressObserver = observer;
    });
    this.initDatabase();
  }

  public getProgressObserver(): Observable<number> {
    return this.progress$;
  }

  async initDatabase() {
    this.db = await this.dbService.get();
    this.initAlbumCache();
  }

  async initAlbumCache() {
    this.db.album
      .find()
      .exec()
      .then(docs => {});
  }
  /**
   * Read Files from local system and push to file handler subject.
   * @param files
   */
  public async readFiles(files: any) {
    this.fileCount = files.length;
    this.processedTracks = 0;
    this.albumSize = 0;
    this.processedAlbumCnt = 0;
    this.albumTracksMap.clear();
    this.artistAlbumMap.clear();
    this.imgCacheMap.clear();

    for (const file of files) {
      if (file && file.type.match(this.fileType)) {
        this.createDBDocuments(file, file.path);
      }
    }
    return;
  }

  public async readMediaTags(files: any) {
    this.fileCount = files.length;
    this.processedTracks = 0;
    this.albumSize = 0;
    this.processedAlbumCnt = 0;
    this.albumTracksMap.clear();
    this.artistAlbumMap.clear();
    this.imgCacheMap.clear();

    files.forEach(file => {
      fs.readFile(file, (err, data) => {
        if (err) {
          throw err;
        }
        this.createDBDocuments(data, file);
      });
    });

    return;
  }

  public async createDBDocuments(file, path) {
    jsmediatags.read(file, {
      onSuccess: async tag => {
        console.log("Reading tags:", file);

        let trackDoc = this.db.track.newDocument({});
        trackDoc.DocType = "track";
        let tags = tag.tags;
        if (tags) {
          if (tags.title) {
            trackDoc.TrackName = tags.title;
          } else {
            if(file.name){
              trackDoc.TrackName = file.name.replace(/\.[^/.]+$/, "");
            } else {
              trackDoc.TrackName = 'Unknown';
            }
          }

          if (tags.artist) {
            trackDoc.Artist = tags.artist;
          } else {
            trackDoc.Artist = "Unknown";
          }

          trackDoc.TrackNumber = tags.track;
          trackDoc.Year = tags.year;
          if (tags.album) {
            trackDoc.Album = tags.album;
          } else {
            trackDoc.Album = "Unknown";
          }

          trackDoc.Genres = [file.genre];
          trackDoc.Lyrics = file.lyrics;
          trackDoc.Source = "desktop";
          trackDoc.Link = path;

          let image = tags.picture;

          // var blob = new Blob([tags.picture.data], { type: tags.picture.format });

          if (image) {
            let imgCache = this.imgCacheMap.get(trackDoc.Album);
            if (trackDoc.Album !== "Unknown" && imgCache) {
              trackDoc.Image = imgCache;
            } else {
              let img64 = this.processImage(image);
              this.imgCacheMap.set(trackDoc.Album, img64);
              trackDoc.Image = img64;
            }
          } else {
            trackDoc.Image = "None";
          }

          this.saveTrackDocument(trackDoc);
          console.log("Done Reading tags");
        }
      },
      onError: async error => {
        console.log(error);
        let trackDoc = this.db.track.newDocument({});
        trackDoc.DocType = "track";
        trackDoc.TrackName = file.name.replace(/\.[^/.]+$/, "");
        trackDoc.Album = "Unknown";
        trackDoc.Artist = "Unknown";
        trackDoc.Link = file.path;
        trackDoc.Image = "None";
        this.saveTrackDocument(trackDoc);
      }
    });

    console.log("outside read tags:");
  }

  private processImage(image) {
    let base64String = "";
    for (var i = 0; i < image.data.length; i++) {
      base64String += String.fromCharCode(image.data[i]);
    }
    return "data:image/jpeg;base64," + window.btoa(base64String);
  }

  private saveTrackDocument(trackDoc) {
    trackDoc
      .save()
      .then(doc => {
        // trackDoc.putAttachment({
        //   id: "Image",
        //   data: blob,
        //   type: "image/jpeg"
        // }).then((at) => {
        //   console.log(at)
        // }).catch((e) => {
        //   console.log(e)
        // })

        this.processedTracks++;
        this.buildAlbumCache(trackDoc);
        this.buildArtistCache(trackDoc)
        if (this.processedTracks == this.fileCount) {
          this.saveAlbumDocuments();
          this.saveArtistData();
        }
      })
      .catch(error => {
        throw new Error(error);
      });
  }

  private buildAlbumCache(trackDoc) {
    if (this.albumTracksMap.get(trackDoc.Album)) {
      let albumDoc = this.albumTracksMap.get(trackDoc.Album);
      let trackArr = albumDoc.Tracks.slice(0);
      trackArr.push(trackDoc._id);
      albumDoc.Tracks = trackArr;
      this.albumTracksMap.set(trackDoc.Album, albumDoc);
    } else {
      let albumDoc = this.db.album.newDocument();
      albumDoc = this.setAlbumData(trackDoc, albumDoc);
      this.albumTracksMap.set(trackDoc.Album, albumDoc);
    }

    this.progress = Math.round((this.processedTracks / this.fileCount) * 100);
    this.progressObserver.next(this.progress);
  }

  private setAlbumData(track, albumDoc) {
    if (track.Album) {
      albumDoc.AlbumName = track.Album;
    } else {
      albumDoc.AlbumName = "Unknown";
    }
    albumDoc.Artist = track.Artist;
    albumDoc.Year = track.Year;
    albumDoc.Tracks = [track._id];
    albumDoc.Selection = "close";
    albumDoc.AlbumImage = track.Image;
    return albumDoc;
  }

  private saveAlbumDocuments() {
    this.albumSize = this.albumTracksMap.size;
    this.albumTracksMap.forEach((album, albumName) => {
      this.db.album
        .findOne()
        .where("AlbumName")
        .eq(albumName)
        .exec()
        .then(albumDbDoc => {
          if (albumDbDoc) {
            let trackArr = albumDbDoc.Tracks.slice(0);
            trackArr.push(...album.Tracks);
            albumDbDoc.Tracks = trackArr;
            albumDbDoc.save();
          } else {
            album.save();
          }
          this.progressObserver.next(0);
        });

      console.log("album saving done.");
    });
  }

  private buildArtistCache(trackDoc) {
    let artistDoc = this.artistAlbumMap.get(trackDoc.Artist);
    if (artistDoc) {
      let albumArr = artistDoc.Albums.slice(0);
      let album = albumArr.filter((album) => album.AlbumName === trackDoc.Album) 

      if(album && album.length === 1) {  
        album[0].Tracks.push(trackDoc._id)
      } else {
        let artistAlbum = {
          "AlbumName": trackDoc.Album,
          "Tracks": [trackDoc._id]
        }
        albumArr.push(artistAlbum)
      }
      artistDoc.Albums = albumArr;
      this.artistAlbumMap.set(artistDoc.ArtistName, artistDoc);
    } else {
      let artistDoc = this.db.artist.newDocument();
      artistDoc = this.setArtistData(artistDoc, trackDoc);
      this.artistAlbumMap.set(artistDoc.ArtistName, artistDoc);
    }

  }

  setArtistData(artistDoc, trackDoc) {
    if (trackDoc.Artist) {
      artistDoc.ArtistName = trackDoc.Artist;
    } else {
      artistDoc.ArtistName = "Unknown";
    }

    let artistAlbum = {
      "AlbumName": trackDoc.Album,
      "Tracks": [trackDoc._id]
    }
    artistDoc.Albums = [artistAlbum];
    return artistDoc;
  }

  private saveArtistData() {
 
    this.artistAlbumMap.forEach((artist, artistName) => {

      this.db.artist
        .findOne()
        .where("ArtistName")
        .eq(artistName)
        .exec()
        .then((doc) => {
          console.log('artist:',doc)
          if (doc) {
            let dbAlbumArr = doc.Albums.slice(0);
            let newAlbumArr = artist.Albums;

            newAlbumArr.map((newAlbum) => {
              
              let dbAlbum = dbAlbumArr.find((dbAlbum) => {
                if(dbAlbum.AlbumName === newAlbum.AlbumName) {
                  return dbAlbum;
                }
              })
              
              if(dbAlbum) {
                dbAlbum.Tracks.push(...newAlbum.Tracks)
              } else {
                dbAlbumArr.push(...newAlbum)
              }

            })
            doc.Albums = dbAlbumArr;
            doc.save();
          } else {
            artist.save()
          }
          this.progressObserver.next(0);
        });
      console.log("artist saving done.");
    });
  }
}

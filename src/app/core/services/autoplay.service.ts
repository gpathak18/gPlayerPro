import { PlaylistService} from './playlist.service';
import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import { Track } from '../models/track';

@Injectable({
  providedIn: 'root'
})
export class AutoplayService {

  private autoPlaylists : Array<Track> = new Array();
  public autoPlaylistSubject = new BehaviorSubject<Array<Track>>(this.autoPlaylists); 

  constructor() { 
    this.autoPlaylistSubject.subscribe((tracks) => {
      this.autoPlaylists = tracks;
    });
  }

  public updateAutoPlaylist(tracks){
    console.log('update auto', tracks)
    this.autoPlaylistSubject.next(tracks);
  }

  public addPlayNext(track) {
    this.autoPlaylists.unshift(track);
    this.updateAutoPlaylist(this.autoPlaylists);
  }

  public addToQueue(track) {
    this.autoPlaylists.push(track);
    this.updateAutoPlaylist(this.autoPlaylists);
  }

  public clearQueue(){
    this.autoPlaylists.length = 0;
    this.updateAutoPlaylist(this.autoPlaylists);
  }

  public getTrackToPlay(){
    let track = this.autoPlaylists.shift();
    if(track){
      this.autoPlaylists.push(track);      
    }
    this.updateAutoPlaylist(this.autoPlaylists);
    return track;
  }

  public getPreviousTrackToPlay(){
    let track = this.autoPlaylists.pop();
    this.autoPlaylists.unshift(track);
    this.updateAutoPlaylist(this.autoPlaylists);
    return track;
  }

  public dequeueTrackAtIndex(id) {
     this.autoPlaylists = this.autoPlaylists.filter((track:any) => track._Id != id)
     this.updateAutoPlaylist(this.autoPlaylists);
  }

}

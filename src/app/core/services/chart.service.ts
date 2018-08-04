import { Injectable } from '@angular/core';
import { HttpClient } from '../../../../node_modules/@angular/common/http';
import { tap } from '../../../../node_modules/rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  baseUrl = 'https://ws.audioscrobbler.com/2.0/?'

  topArtistUrl = 'method=chart.gettopartists&api_key=c04a68b58466c951cc51bda04ab62d2b&format=json&page=1&limit=10'

  weeklyTopTenUrl = 'method=chart.gettoptracks&api_key=c04a68b58466c951cc51bda04ab62d2b&format=json&page=1&limit=10'

  similarTracksUrl = 'method=track.getsimilar&api_key=c04a68b58466c951cc51bda04ab62d2b&format=json&track=thriller&artist=jackson&autocorrect=1'


  constructor(private http: HttpClient) { 
   
  }

  getTopArtists() {
    return this.http.get(this.baseUrl+this.topArtistUrl, {responseType: 'json'});
  }

  getWeeklyTopTen() {
    return this.http.get(this.baseUrl+this.weeklyTopTenUrl, {responseType: 'json'});
  }

  getSimilarTracks() {
    return this.http.get(this.baseUrl+this.similarTracksUrl, {responseType: 'json'});
  }

}

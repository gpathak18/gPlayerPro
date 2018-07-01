import { Injectable } from '@angular/core';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  static formatTime(time) {
    var minutes = Math.floor((time % 3600) / 60);
    var seconds = ('00' + Math.floor(time % 60)).slice(-2);
    return minutes + ':' + seconds;
  }

  static truncateString(string, maxLen) {
    if (string && string.length > maxLen) {
      return string.substring(0, maxLen - 3) + '...';
    } else {
      return string;
    }
  }

  static getUUID() {
    const id: string = uuid();
    return id;
  }
}

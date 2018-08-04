import { Injectable } from '@angular/core';
import { FilehandlingService } from './filehandling.service';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {

  constructor(private fileHandlingService: FilehandlingService) { 


  }
  

}

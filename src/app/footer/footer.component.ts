import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../core/services/player.service';
import { fadeAnimation } from '../core/animations/fade.animation';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  animations: [fadeAnimation]
})
export class FooterComponent implements OnInit {

  private volumeIcon = 'volume_up';
  public volume = 100;

  constructor(private playerService: PlayerService) { }

  ngOnInit() {
  }

  private updateVolume($event){
    let value = $event.value

    if(value === 0){
      this.volumeIcon = 'volume_mute'
    }else if(value < 50){
      this.volumeIcon = 'volume_down'
    }else{
      this.volumeIcon = 'volume_up'
    }

    this.volume = value
    this.playerService.setVolume(this.volume/100)
  }

}

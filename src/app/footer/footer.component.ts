import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { PlayerService } from '../core/services/player.service';
import { fadeAnimation } from '../core/animations/fade.animation';
import { FilehandlingService } from '../core/services/filehandling.service';
import { Router } from '@angular/router';
import { AutoplayService } from '../core/services/autoplay.service';
import { Subject } from 'rxjs';
declare const window: any;
const { ipcRenderer, remote } = window.require("electron")
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  animations: [fadeAnimation]
})
export class FooterComponent implements OnInit {
  @ViewChild('file') input; 

  public volumeIcon = 'volume_up';
  public playPauseState = 'pause'
  // public progObject = {
  //   "total": 0,
  //   "currentCount":  0,
  //   "file": ""
  // }
  public uploadProgress = 0;
  public hover = false;
  public volume = 100;

  constructor(private playerService: PlayerService,
    private fileHandlingService: FilehandlingService,
    private autoplayService: AutoplayService,
    private router: Router,
    private zone: NgZone,
    private oauthService: OAuthService
  ) { }

  ngOnInit() {

    this.fileHandlingService.getProgressObserver().subscribe(progress => {
      this.zone.run(() => {
        this.uploadProgress = progress;
      })
    })

    this.autoplayService.autoPlaylistSubject.subscribe((autoPlayQueue) => {

    })

    this.playerService.nowPlaying.subscribe((track: any) => {

    })

  }

  private updateVolume($event) {
    let value = $event.value

    if (value === 0) {
      this.volumeIcon = 'volume_mute'
    } else if (value < 50) {
      this.volumeIcon = 'volume_down'
    } else {
      this.volumeIcon = 'volume_up'
    }

    this.volume = value
    this.playerService.setVolume(this.volume / 100)
  }

  public changeListener($event): void {
    // this.fileHandlingService.readFiles($event.target.files)
  }

  check(){
    // this.input.nativeElement.click()
    // this.oauthService.initImplicitFlow();
    ipcRenderer.send('OpenFileDialog', 'OpenFileDialog')
    // ipcRenderer.on('got-window', (event, arg) => {
    //   console.log(arg)
    // })
  }

  public togglePlayPauseState() {
    if (this.playPauseState == 'play') {
      this.playerService.pause();
    } else {
      this.playerService.play();
    }
  }

}

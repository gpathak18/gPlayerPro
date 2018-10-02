import { UtilityService } from '../core/services/utility.service';
import { PlayerService } from '../core/services/player.service';
import { Component, OnInit } from '@angular/core';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import MinimapPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.minimap.min.js';
import WebAudio from 'wavesurfer.js/src/webaudio.js'

@Component({
  selector: 'app-waveform',
  templateUrl: './waveform.component.html',
  styleUrls: ['./waveform.component.css']
})
export class WaveformComponent implements OnInit {

  private player = null;
  private isScroll: boolean = true;
  private waveformHeight = 30;
  // linear-gradient(90deg, rgba(217, 96, 189, .8), rgba(0, 208, 255, .9))
  // linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%),
  //   linear-gradient(336deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%);
  private options = {
    container: '#waveform',
    waveColor: 'hsla(0, 0%, 100%, 0.7)',
    height: this.waveformHeight,
    audioRate: 1,
    scrollParent: this.isScroll,
    hideScrollbar: true,
    progressColor: 'hsla(36, 100%, 50%, 0.5)',
    cursorColor: 'dimgrey',
    barWidth: 5,
    backend: 'WebAudio',
    autoCenter: true
  };

  private EQ = [
    {
      f: 32,
      type: 'lowshelf'
    }, {
      f: 64,
      type: 'peaking'
    }, {
      f: 125,
      type: 'peaking'
    }, {
      f: 250,
      type: 'peaking'
    }, {
      f: 500,
      type: 'peaking'
    }, {
      f: 1000,
      type: 'peaking'
    }, {
      f: 2000,
      type: 'peaking'
    }, {
      f: 4000,
      type: 'peaking'
    }, {
      f: 8000,
      type: 'peaking'
    }, {
      f: 16000,
      type: 'highshelf'
    }
  ];

  private filters;
  private bassFilter;

  private songDuration: string = '0:00';
  private currentTime: string = '0:00';
  private timeNow: string = '0:00';
  private audioContext;

  constructor(
    private playerService: PlayerService
  ) {

  }

  ngOnInit() {


    if (this.playerService.getPlayer() != null) {
      this.player = this.playerService.getPlayer();
      if (this.player.backend.buffer != null) {
        this.player.drawer.containerWidth = this.player.drawer.container.clientWidth;
        this.player.drawBuffer();
      }
    } else {

      this.player = new WaveSurfer(this.options);
      this.player.init();
      this.player.createBackend();
      this.setupPlayerEvents();
      this.setupPlayerEqFilters();
      this.player.setVolume(70 / 100);
      this.playerService.setPlayer(this.player);
      
    }


    this.playerService.nowPlaying.subscribe((track: any) => {
      this.player.load(track.Link);
      this.player.on('ready', this.player.play.bind(this.player));
    });

    this.playerService.playPause.subscribe((playPauseState: any) => {

      if (playPauseState === 'play') {
        this.player.play()
      } else if (playPauseState === 'pause') {
        this.player.pause()
      } else {
        this.player.stop()
      }

    });

  }

  ngAfterViewInit() {

  }

  private setupPlayerEqFilters() {

    this.filters = this.EQ.map((band) => {
      var filter = this.player.backend.ac.createBiquadFilter();
      filter.type = band.type;
      filter.gain.value = 0;
      filter.Q.value = 1;
      filter.frequency.value = band.f;
      return filter;
    });

    this.player.backend.setFilters(this.filters);

  }

  private setupPlayerEvents() {

    this.player.on('audioprocess', time => {
      if (this.player.isPlaying()) {
        this.timeNow = UtilityService.formatTime(time)
      }
      this.currentTime = this.timeNow;
    });

    this.player.on('play', () => {
      let time = this.player.getDuration();
      this.songDuration = UtilityService.formatTime(time);
    });

    this.player.on('pause', () => {
    });

    this.player.on('load', () => {
      let time = this.player.getDuration();
      this.songDuration = UtilityService.formatTime(time)
    });

    this.player.on('finish', () => {
      this.playerService.playNext();
    });

    this.player.on('stop', () => {
    });

    this.player.on('loading', (a, b) => {
    });

  }

}

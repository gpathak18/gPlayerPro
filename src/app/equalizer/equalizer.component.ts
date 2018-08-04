import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { PlayerService } from '../core/services/player.service';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { UiService } from '../core/services/ui.service';

@Component({
  selector: 'app-equalizer',
  templateUrl: './equalizer.component.html',
  styleUrls: ['./equalizer.component.css']
})
export class EqualizerComponent implements OnInit {

  minLength = 0;
  private player;
  presetControl: FormControl = new FormControl();
  filteredPresets: any;
  selectedPreset = 'Flat';
  presets = [
    { preset: 'Acoustic', setting: [3, 6, 4, 2, 6, 7, 8, 2, 1, 4], icon: 'ac_unit' },
    { preset: 'Bass Booster', setting: [3, 3, 4, 2, 4, 7, 8, 2, 1, 4], icon: 'vibration' },
    // { preset: 'Bass Reducer', setting: [3, 2, 4, 1, 6, 7, 6, 2, 1, 4], icon: 'panorama_vertical' },
    { preset: 'Classical', setting: [3, 6, 4, 2, 6, 2, 8, 2, 1, 4], icon: 'class' },
    { preset: 'Dance', setting: [3, 6, 4, 2, 6, 7, 8, 2, 1, 4], icon: 'speaker' },
    { preset: 'Deep', setting: [3, 6, 4, 2, 6, 7, 8, 2, 1, 5], icon: 'favorite' },
    { preset: 'Electronic', setting: [3, 6, 4, 2, 6, 7, 8, 2, 1, 4], icon: 'memory' },
    { preset: 'Flat', setting: [3, 6, 4, 2, 6, 7, 8, 2, 1, 4], icon: 'view_headline' },
    { preset: 'Hip-Hop', setting: [3, 6, 4, 2, 6, 7, 8, 2, 1, 4], icon: 'hearing' },
    // { preset: 'Jazz', setting: [3, 6, 4, 2, 6, 7, 8, 2, 1, 4], icon: 'spa' },
    // { preset: 'Latin', setting: [3, 6, 4, 2, 6, 7, 8, 2, 1, 4], icon: '' },
    { preset: 'Loudness', setting: [3, 6, 5, 2, 6, 7, 8, 2, 1, 4], icon: 'wb_sunny' },
    // { preset: 'Lounge', setting: [3, 6, 4, 2, 6, 7, 8, 2, 1, 4], icon: 'event_seat' },
    // { preset: 'Piano', setting: [3, 6, 4, 2, 6, 7, 8, 2, 1, 4], icon: '' },
    { preset: 'Pop', setting: [3, 6, 4, 2, 6, 7, 8, 2, 1, 4], icon: 'thumb_up' },
    { preset: 'R&B', setting: [3, 6, 4, 2, 6, 7, 8, 2, 1, 4], icon: 'timeline' },
    { preset: 'Rock', setting: [3, 6, 4, 2, 6, 7, 8, 2, 1, 4], icon: 'waves' },
    // { preset: 'Small Speakers', setting: [3, 6, 4, 2, 6, 7, 8, 2, 1, 4], icon: 'headset' },
    // { preset: 'Spoken Word', setting: [3, 6, 4, 2, 6, 7, 8, 2, 1, 4], icon: 'mic' },
    // { preset: 'Treble Booster', setting: [3, 6, 4, 2, 6, 7, 8, 2, 1, 4], icon: 'signal_cellular_alt' },
    // { preset: 'Treble Reducer', setting: [3, 6, 4, 2, 6, 7, 8, 2, 1, 4], icon: 'graphic_eq' },
    { preset: 'Vocal Booster', setting: [3, 6, 4, 2, 6, 7, 8, 2, 1, 4], icon: 'mic' },
  ];


  public eqSliders = [
    {
      f: 32,
      type: 'peaking',
      value: 0
    }, {
      f: 64,
      type: 'peaking',
      value: 0
    }, {
      f: 125,
      type: 'peaking',
      value: 0
    }, {
      f: 250,
      type: 'peaking',
      value: 0
    }, {
      f: 500,
      type: 'peaking',
      value: 0
    }, {
      f: '1k',
      type: 'peaking',
      value: 0
    }, {
      f: '2k',
      type: 'peaking',
      value: 0
    }, {
      f: '4k',
      type: 'peaking',
      value: 0
    }, {
      f: '8k',
      type: 'peaking',
      value: 0
    }, {
      f: '16k',
      type: 'peaking',
      value: 0
    }
  ];

  private filters;

  private autoTicks = false;
  private disabled = false;
  private invert = false;
  private max = 40;
  private min = -40;
  private showTicks = false;
  private step = 1;
  private thumbLabel = true;
  private vertical = true;

  private song = '../../../assets/song.mp3'


  constructor(private playerService: PlayerService, private uiService: UiService) {
    // this.filteredPresets = this.presetControl.valueChanges.pipe(startWith(null)).pipe(map(name => this.filterPresets(name)));
  }

  ngOnInit() {
    this.player = this.playerService.getPlayer();
    this.setupPlayerEqFilters();
    this.setEqSliderValue();

    let analyser = this.player.backend.ac.createAnalyser();
    this.filters.push(analyser);
    this.player.backend.setFilters(this.filters);
    this.uiService.setPlayerAnalyser(analyser);

    this.player.load(this.song);
    this.player.on('ready', this.player.play.bind(this.player));
  }

  setEqSliderValue() {

    this.eqSliders.map((slider, i) => {
      slider.value = this.filters[i].gain.value;
    })

    console.log(this.eqSliders)
  }

  setEqPreset(selectedPreset) {

    let presetSetting = this.presets.filter((p) => p.preset === selectedPreset).map((obj) => {
      return obj.setting;
    });

    if (presetSetting && presetSetting[0]) {
      let setting = presetSetting[0];
      this.eqSliders.map((slider, i) => {
        slider.value = this.filters[i].gain.value = Number(setting[i]);
      })
    }

  }

  private setupPlayerEqFilters() {

    this.filters = this.eqSliders.map((band) => {
      let filter = this.player.backend.ac.createBiquadFilter();
      filter.type = band.type;
      filter.gain.value = 0;
      filter.Q.value = 0.5;
      switch (band.f) {
        case '1k':
          filter.frequency.value = 1000;
          break;
        case '2k':
          filter.frequency.value = 2000;
          break;
        case '4k':
          filter.frequency.value = 4000;
          break;
        case '8k':
          filter.frequency.value = 8000;
          break;
        case '16k':
          filter.frequency.value = 16000;
          break;
        default:
          filter.frequency.value = band.f;
      }
      return filter;
    });



  }

  resetSlider(event) {
    event.value = 0;
    this.updateEqBand(event)
  }

  updateEqBand($event) {

    const id = $event.source._elementRef.nativeElement.id;

    switch (id) {
      case '32':
        this.filters[0].gain.value = $event.value;
        break;
      case '64':
        this.filters[1].gain.value = $event.value;
        break;
      case '125':
        this.filters[2].gain.value = $event.value;
        break;
      case '250':
        this.filters[3].gain.value = $event.value;
        break;
      case '500':
        this.filters[4].gain.value = $event.value;
        break;
      case '1k':
        this.filters[5].gain.value = $event.value;
        break;
      case '2k':
        this.filters[6].gain.value = $event.value;
        break;
      case '4k':
        this.filters[7].gain.value = $event.value;
        break;
      case '8k':
        this.filters[8].gain.value = $event.value;
        break;
      case '16k':
        this.filters[9].gain.value = $event.value;
        break;
      default:

    }
    console.log(id);

  }


  // filterPresets(val: string) {
  //   if (val && val.length >= this.minLength) {
  //     return this.presets.filter(s => s.toLowerCase().indexOf(val.toLowerCase()) === 0);
  //   } else {
  //     return this.presets;
  //   }
  // }

}


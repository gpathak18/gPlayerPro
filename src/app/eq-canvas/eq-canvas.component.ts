import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { PlayerService } from '../core/services/player.service';
import { UiService } from '../core/services/ui.service';

@Component({
  selector: 'app-eq-canvas',
  templateUrl: './eq-canvas.component.html',
  styleUrls: ['./eq-canvas.component.css']
})
export class EqCanvasComponent implements OnInit {

  @ViewChild('canvas', {static: false}) public canvas: ElementRef;

  // setting a width and height for the canvas
  @Input() public width = 800;
  @Input() public height = 260;

  private canCtx: CanvasRenderingContext2D;

  private player;
  private analyser;
  private dataArray;
  private bufferLength;

  constructor(private playerService: PlayerService, private uiService: UiService) { }

  ngOnInit() {

    // this.player = this.playerService.getPlayer();
    // this.player.load(this.song);
    // this.analyser = this.player.backend.analyser
    // this.player.backend.ac.source.connect()
    this.analyser = this.uiService.getAnalyser();
    this.setFFTSize(1024);

    // this.player.on('ready', this.player.play.bind(this.player));

    
  }

  setFFTSize(fftSize: any){
    this.analyser.fftSize = fftSize;
    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);
  }

  public ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.canCtx = canvasEl.getContext('2d');
    canvasEl.width =  this.width;
    canvasEl.height = this.height;
    this.canCtx.clearRect(0, 0, this.width, this.height);
    // this.drawCurve();
    this.drawBar();
  }

  public drawCurve() {

    requestAnimationFrame(this.drawCurve.bind(this));

    this.analyser.getByteFrequencyData(this.dataArray);

    this.canCtx.fillStyle = '#f5f5f5';
    this.canCtx.fillRect(0, 0, this.width, this.height);
    
    let curveBase = this.width / this.bufferLength;
    let barHeight;
    let x = 0;

    this.canCtx.beginPath();
    this.canCtx.moveTo(0,this.height);

    for (var i = 0; i < this.bufferLength; i++) {
      barHeight = this.dataArray[i];
      this.canCtx.fillStyle = 'hsla('+ barHeight +', 100%, 50%, 0.8)';
      this.canCtx.lineTo(x,this.height - barHeight);
      x += curveBase;
    }

    this.canCtx.lineTo(x,this.height);
    this.canCtx.lineTo(0,this.height);
    this.canCtx.fill();
    this.canCtx.closePath();
  }

  public drawBar() {

    requestAnimationFrame(this.drawBar.bind(this));

    this.analyser.getByteFrequencyData(this.dataArray);

    this.canCtx.fillStyle = '#f5f5f5';
    this.canCtx.fillRect(0, 0, this.width, this.height);
    
    let barWidth = this.width / this.bufferLength
    let barHeight;
    let x = 0;

    for (var i = 0; i < this.bufferLength; i++) {

      barHeight = this.dataArray[i];
      this.canCtx.fillStyle = 'hsla('+ barHeight +', 100%, 50%, 0.8)';
      this.canCtx.fillRect(x, this.height - barHeight, barWidth, barHeight);
      x += barWidth;

    }

  }


  getRandomColor() {
    let length = 6;
    let chars = '0123456789ABCDEF';
    let hex = '#';
    while(length--) {
      hex += chars[(Math.random() * 16) | 0];
    }
    return hex;
  }

}

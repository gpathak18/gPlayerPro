import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiService {


  private analyser: any
  private analyserGraph = 'curve'

  constructor() { }

  setPlayerAnalyser(analyser){
    this.analyser = analyser;
  }

  getAnalyser() {
    return this.analyser;
  }
  
  setAnalyserGraphType(graphType){
    this.analyserGraph = graphType;
  }

  getAnalyserGraphType() {
    return this.analyserGraph;
  }
  
}

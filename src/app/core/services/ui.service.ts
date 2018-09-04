import { Injectable,ComponentFactoryResolver,
  Inject,
  ReflectiveInjector } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class UiService {


  private analyser: any
  private analyserGraph = 'curve'
  private factoryResolver
  private rootViewContainer 

  constructor(factoryResolver : ComponentFactoryResolver) {
    this.factoryResolver = factoryResolver
  }

  setRootViewContainerRef(viewContainerRef) {
    this.rootViewContainer = viewContainerRef
  }

  addDynamicComponent(dynamicComponent) {
    const factory = this.factoryResolver
                        .resolveComponentFactory(dynamicComponent)
    const component = factory
      .create(this.rootViewContainer.parentInjector)
    this.rootViewContainer.insert(component.hostView)
  }

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

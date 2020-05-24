import { PlaylistService } from "../core/services/playlist.service";
import {
  Component,
  OnInit,
  NgZone,
  AfterViewInit,
  HostListener,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentFactory,
  ComponentRef
} from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { DatabaseService } from "../core/services/database.service";
import { RxDocument } from "rxdb";
import { accordionTransition } from "../core/animations/accordion.animation";
import { TableviewComponent } from "../tableview/tableview.component";
import { fromEvent } from "rxjs/internal/observable/fromEvent";
import { debounceTime } from "rxjs/internal/operators/debounceTime";
import { distinctUntilChanged } from "rxjs/internal/operators/distinctUntilChanged";

@Component({
  selector: "app-allmusic",
  templateUrl: "./allmusic.component.html",
  styleUrls: ["./allmusic.component.css"]
})
export class AllmusicComponent implements AfterViewInit {

  @ViewChild("tableContainer",{read: ViewContainerRef, static: false}) 
  container: ViewContainerRef;
  
  @ViewChild("tableDiv",{static: false}) table;

  private page = 0;
  private componenets = new Map()

  constructor(private resolver: ComponentFactoryResolver) {}

  ngOnInit() {
   
  }

  async createComponent(page) {
    let componentRef: ComponentRef<TableviewComponent>;
    const factory: ComponentFactory<TableviewComponent> = this.resolver.resolveComponentFactory(TableviewComponent);
    componentRef = this.container.createComponent(factory);
    componentRef.instance.page = page;
    this.componenets.set(this.page,componentRef)
  }

  clearComponent(page) {
    let com = this.componenets.get(page-3)
    com.location.nativeElement.remove();
  }

  ngAfterViewInit() {
    this.createComponent(this.page);
  }

  ngOnDestroy() {}
}

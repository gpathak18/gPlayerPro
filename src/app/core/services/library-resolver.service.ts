import { Injectable, NgZone } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { Observable } from "rxjs";
import { DatabaseService } from "./database.service";
import { DOCUMENT } from "@angular/common";

@Injectable({
  providedIn: "root"
})
export class LibraryResolverService implements Resolve<any> {
  private skipCount = 0;
  private limitCount = 100;

  constructor( ) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return ''
  }

}

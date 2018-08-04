import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler {

  constructor(private injector: Injector) { }

  handleError(error: any): void {

    const router = this.injector.get(Router);

    if (error instanceof HttpErrorResponse) {
      // Server or connection error happened
      if (!navigator.onLine) {
        // Handle offline error
      } else {
        // Handle Http Error (error.status === 403, 404...)
      }
    } else {
      // router.navigate(['/error'], { queryParams: { error: error } });
      // Route to home page, refresh everything, keep music playing
    }

    console.error('Error Occured: ', error);
  }


}

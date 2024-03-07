import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LocalStorageService } from '../services/local-storage.service';


@Injectable({
  providedIn: 'root'
})

export class ErrorInterceptorService implements HttpInterceptor {

  constructor(private router: Router, private storageService: LocalStorageService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const appError: HTMLElement = document.getElementsByClassName('app-error').item(0) as HTMLElement;
    if (appError) {
        appError.style.display = 'none';
    }
      return next.handle(request).pipe(
        tap(
          event => { },
          error => { 
            if (error instanceof HttpErrorResponse) {
              // Perform an action based on error;
              if (error.status === 403) {
                this.router.navigate(['']);
                this.storageService.removeToken();
              } else if (error.status === 401) {
                this.router.navigate(['401']);  //re-route to unauthorized page
              } 
              else if (error.status === 500 && appError) {
                appError.style.display = 'block';
              }
            }
          }
        ));
  }


}

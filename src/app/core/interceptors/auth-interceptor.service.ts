import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';
import { GeneralService } from '../services/general.service';
@Injectable({
  providedIn: 'root'
})


export class AuthInterceptorService implements HttpInterceptor {
  // public auth: AuthService
  constructor(private storageService: LocalStorageService, private gs: GeneralService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //const token = (request.headers.get('skipAuth'))?this.storageService.getToken():((request.headers.get('sharedToken'))?this.gs.getExternalToken():"");
    let token=this.storageService.getToken();
    let companyId = this.storageService.companyId;
    if (request.headers.get('skipAuth')) {
      request = request.clone({
          headers: request.headers.delete('skipAuth')
      });
    return next.handle(request);
    }
   
    else {
      if (request.headers.get('sharedToken')) {
        token = this.gs.getExternalToken();
        request = request.clone({
          headers: request.headers.delete('sharedToken')
        });
      }
      if (companyId && token) {
        request = request.clone({
          headers:
            request.headers.set('Authorization', token).set('companyid', this.storageService.companyId)
        });
      }
      else if (token) {
        request = request.clone({
          headers:
            request.headers.set('Authorization', token)
        });
      }

      //  if(this.auth.isAuthenticated)
      //  {
      //    request = request.clone({ headers: request.headers.set( 'Authorization', 'Bearer '+this.auth.authToken)});
      //  }
      //  else
      //  {
      //  //  this.router.navigate(['LoginPage']);
      //  }
  
      return next.handle(request);
    }

  }

}

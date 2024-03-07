import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { GeneralService } from 'src/app/core/services/general.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class StoreAuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService, private storageService: GeneralService) {}

  async canActivate( route: ActivatedRouteSnapshot): Promise<any>{
    const token = this.storageService.getExternalToken();
    if (!token) {
      if (window.location.href.indexOf("mobile-scheduler") > -1) {
        this.router.navigate(['mobile-scheduler/404']);
      } else {
        this.router.navigate(['store-app-scheduler/404']);
      }     
    }

    return !!token;
  }
}
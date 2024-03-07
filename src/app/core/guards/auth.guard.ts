import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService, private storageService: LocalStorageService) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    const token = this.storageService.getToken();
    
    if (!token) {
      this.router.navigate(['home/login-page']);
    }

    return !!token;
  }

  async canActivateStore( route: ActivatedRouteSnapshot): Promise<any>{
    const token = this.storageService.getToken();
    
    if (!token) {
      this.router.navigate(['401']);
    }

    return !!token;
  }
}

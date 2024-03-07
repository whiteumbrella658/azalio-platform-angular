import { Injectable } from '@angular/core';
import { CanDeactivate, Router,ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { Observable } from 'rxjs';
import {ConfirmModalComponent} from 'src/app/shared/components/confirm-modal/confirm-modal.component';
import { NbDialogService } from '@nebular/theme';
import { delay, timeout } from 'rxjs/operators';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class SettingsGuard implements CanDeactivate<CanComponentDeactivate>{
  constructor(private router: Router, private authService: AuthService, private storageService: GeneralService, private dialogService: NbDialogService  ) {}
  waitForOneSecond() {
    const dialogRef = this.dialogService.open(ConfirmModalComponent,{ context: ''});
       return dialogRef.onClose.subscribe(async dialogResult => {
        setTimeout(() => {
          dialogResult;
        }, 1000);
     });
    }
 canDeactivate(
    component:CanComponentDeactivate,
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot,
    nextState: RouterStateSnapshot) : Observable<boolean> | Promise<boolean> | boolean {

    if(component.canDeactivate()===true){
    const dialogRef = this.dialogService.open(ConfirmModalComponent,{ context: { proceedButtonText: 'Discard Changes', cancelButtonText: 'Keep Editing' }});
     // if user pressed yes dialogResult will be true, 
    // if he pressed no - it will be false
      const result=dialogRef.onClose.toPromise()
     return result;
    }else{
    return true;
    }
  }
  }

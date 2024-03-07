import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { GeneralService } from 'src/app/core/services/general.service';
import { ForgotPasswordComponent } from '../../components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '../../components/reset-password/reset-password.component';
import { SignUpComponent } from '../../components/sign-up/sign-up.component';
import { VerifyEmailComponent } from '../../components/verify-email/verify-email.component';
import {FirestoreService} from '../../../../core/services/firestore.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  constructor(public gs: GeneralService, private dialogService: NbDialogService, private router: Router,private analytics: FirestoreService,) {}
  loading: boolean;
  email: string;
  token: string;

  ngOnInit(): void {
    this.gs.hideSplashScreen();
    this.parseUrl();
  }

  temp: any = {
    signup: SignUpComponent,
    verify_email: VerifyEmailComponent,
    forgot_password: ForgotPasswordComponent,
    reset_password: ResetPasswordComponent,
  };

  parseUrl = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    this.email = urlParams.get('email');
    this.token = urlParams.get('token');
    // this.showSignInModal = Boolean (urlParams.get('signIn'));

    if (this.email || this.token) {
      if (!this.email || !this.token) {
        // this.gs.showToastError("Invalid request!")
        this.router.navigate(['']);
      } else {
        this.open('reset_password', { email: this.email, token: this.token });
      }
    }
    // else if (this.showSignInModal) {
    //   this.open('signin');
    // }
  };

  open(keyName, data = null) {
    this.dialogService
      .open(this.temp[keyName], { hasBackdrop: true, closeOnBackdropClick: false, context: { data: data } })
      .onClose.subscribe((item) => {
        if (item && item.email) {
          this.open(item.key, item);
        } else if (item) {
          this.open(item, null);
        }
      });
  }
  logoAnalytics(){
    // this.router.navigate(['/home']);
    this.analytics.logEvents('azalio_logo');
   }
}

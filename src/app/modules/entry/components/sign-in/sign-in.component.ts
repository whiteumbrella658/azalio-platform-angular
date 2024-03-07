import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  NbComponentStatus,
  NbDialogRef,
  NbDialogService,
  NbToastrService,
} from '@nebular/theme';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { emailRegex } from 'src/constants';
import { EntryService } from '../../entry.service';
import {FirestoreService} from '../../../../core/services/firestore.service';
import { ForgotPasswordComponent } from '../../components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '../../components/reset-password/reset-password.component';
import { SignUpComponent } from '../../components/sign-up/sign-up.component';
import { VerifyEmailComponent } from '../../components/verify-email/verify-email.component';
import LogRocket from 'logrocket';
import { config } from 'src/environments/configuration';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  form: FormGroup;
  @Input() title;
  @Output() forgotPasswordClicked: EventEmitter<Set<any>> = new EventEmitter();
  loading: boolean;
  showPassword: boolean;
  noRegions: boolean;
  showImage:boolean;
  constructor(
    private dataService: DataSharedService,
    public gs: GeneralService,
    private router: Router,
    private storageService: LocalStorageService,
    private fb: FormBuilder,
    // private ref: NbDialogRef<SignInComponent>,
    private service: EntryService,
    private dialogService: NbDialogService,
    private analytics: FirestoreService,
  ) {}

  ngOnInit(): void {
    this.analytics.logEvents('login_page');
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(emailRegex)]],
      password: ['', [Validators.required]],
    });
  }

  // temp: any = {
  //   forgot_password: ForgotPasswordComponent,
  // }
  temp: any = {
    signup: SignUpComponent,
    verify_email: VerifyEmailComponent,
    forgot_password: ForgotPasswordComponent,
    reset_password: ResetPasswordComponent,
  };
  
  getInputType() {
    if (this.showPassword) {
      return 'text';
    }
    return 'password';
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  submit(ngForm) {
    this.analytics.logEvents('login_button');
    if (ngForm.valid) {
      this.login();
    }
  }

  login = async () => {
    const data = {
      email: this.form.controls.email.value,
      password: this.form.controls.password.value,
    };

    try {
      this.loading = true;
      const response: any = await this.service.login(data);
      let logRocketAppId; 
      if (config.environment?.toLowerCase() === 'prod' || config.environment?.toLowerCase() === 'production') {
        logRocketAppId = '50nqpl/azal';
      } else if (config.environment?.toLowerCase() === 'test' || config.environment?.toLowerCase() === 'demo') {
        logRocketAppId = 'b6qklu/local';
      }
      LogRocket.identify(logRocketAppId, {
        id: response.user.id,
        name: response.user.name,
        email: data.email,
      });
      this.storageService.userId = response.user.id;
      this.storageService.setToken(response['user']?.access_token);
      this.dataService.setConfigurations(null);
      if (response['user']?.isSuperAdmin) {
        this.router.navigate(['admin']);
        return;
      }
      this.dataService.setShowIntroBool(response['user']?.show_intro);
      this.dataService.setShowHighlights(response['user']?.show_highlights);
      if (response['user']?.role_title === 'Account Owner') {
        if (response['user']?.is_askq == 1) {
          this.router.navigate(['askq']);
        } else if (response['user']?.show_intro || response['has_stores'] === false) {
          this.router.navigate(['settings']);
        } else {
          this.router.navigate(['organization']);
        }
      } else {
        this.dataService
          .getConfigurations(false)
          .then((config) => {
            let companyConfig = config.company;
            if (companyConfig.is_askq === 1) {
              this.router.navigate(['askq']);
            } else if (companyConfig.interactive_communication === 1) {
              this.router.navigate(['survey']);
            } else if (config.role.modules?.TimesheetManagement?.enabled) {
              this.router.navigate(['timesheet']);
            } else if (companyConfig.interactive_communication === 1) {
              this.router.navigate(['survey']);
            } else if (companyConfig.is_scheduler === 1 && config.role.modules?.Schedules?.enabled) {
              this.router.navigate(['scheduler']);
            } else if (config.role.modules?.OrganisationManagement?.enabled) {
              this.router.navigate(['organization']);
            } else if (companyConfig.is_tasks === 1 && config.role.modules?.Tasks?.enabled) {
              this.router.navigate(['tasks']);
            } else if (companyConfig.is_rewards === 1 && config.role.modules?.Rewards?.enabled) {
              this.router.navigate(['recognition']);
            } else if (companyConfig.is_communication === 1 && config.role.modules?.Communication?.enabled) {
              this.router.navigate(['communication']);
            } else if (companyConfig.is_settings === 1 && config.role.modules?.Settings?.enabled) {
              this.router.navigate(['settings/required-features']);
            } else {
              this.router.navigate(['401']);
            }
          })
          .finally(() => {});
      }
    } catch (error) {
      console.log(error);
      this.gs.showToastError(error.message);
    } finally {
      this.loading = false;
    }
  };

  open(keyName, data = null) {
    if(keyName==='forgot_password'){
    this.analytics.logEvents('forgot_password');
    } else if(keyName==='signup'){
      this.analytics.logEvents('signup_button');
    }
    this.dialogService.open(this.temp[keyName],{hasBackdrop: true, closeOnBackdropClick: false, context: {data: data}
    }).onClose.subscribe(item => {
      if (item && item.email) {
        this.open(item.key, item);
      } else if (item) {
        this.open(item, null);
      }
    });
  }
}

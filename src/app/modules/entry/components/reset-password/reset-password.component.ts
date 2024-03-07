import { Component,Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {NbDialogRef} from '@nebular/theme';
import { EntryService } from '../../entry.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  form: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  @Input() title;
  loading: Boolean;
  @Input() data;
  password: String;

  constructor(private fb: FormBuilder,private ref:NbDialogRef<ResetPasswordComponent>,
    private service: EntryService, private gs: GeneralService, private router: Router) {

  }

  getInputType() {
    if (this.showPassword) {
      return 'text';
    }
    return 'password';
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  getInputType1() {
    if (this.showConfirmPassword) {
      return 'text';
    }
    return 'password';
  }

  toggleShowConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      password: ['',[Validators.required,Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,25}$/)]],
      confirm_password: ['']
    },
    {
      validator: this.ConfirmPasswordValidator("password","confirm_password")
    }
    )
  }

  submit(ngForm) {
    if(ngForm.valid) {
      this.loading = true;
      this.resetPassword();
    }
  }

  resetPassword = async () => {
    const data = {
      "email": this.data.email,
      "token": this.data.token,
      "password": this.form.controls.password.value
    }

    try {
      const response: any = await this.service.updatePassword(data);
      this.gs.showToastSuccess(response?.message);
      setTimeout(() => {
        this.close();
        // this.router.navigate(['home'], { queryParams: { signIn: true}});
        this.router.navigate(['home/login-page']);
      }, 1000);
    } catch (error) {
      this.gs.showToastError(error.message);
    } finally {
      this.loading = false;
      this.close()
    }
  }

  ConfirmPasswordValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      let control = formGroup.controls[controlName];
      let matchingControl = formGroup.controls[matchingControlName]
      if (matchingControl.errors && matchingControl.errors.confirmPasswordValidator) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ passwordNotMatch: true });
      } else if (matchingControl.value == '') {
        matchingControl.setErrors({ required: true });
      }
      else {
        matchingControl.setErrors(null);
      }
    };
  }

  close() {
    this.ref.close();
  }

}

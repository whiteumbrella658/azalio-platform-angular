import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { GeneralService } from 'src/app/core/services/general.service';
import { avatarOpacity } from 'src/constants';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  @Input() user;
  @Input() companyId;

  form: FormGroup;
  showPassword: boolean;
  loading: boolean;
  opacity: any = avatarOpacity;

  constructor(
    private service: AdminService,
    private gs: GeneralService,
    private fb: FormBuilder,
    private ref: NbDialogRef<ResetPasswordComponent>, 
    ) {
  }

  ngOnInit(): void {
    this.addFormValues();
  }
  
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  addFormValues = () => {
    this.form = this.fb.group({
      password: ['',[Validators.required,Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,25}$/)]]
    });
  }

  getInputType() {
    if (this.showPassword) {
      return 'text';
    }
    return 'password';
  }

  async submit(ngForm) {
    if(ngForm.valid) {
      if (this.loading) {
        return;
      }
      this.loading = true;
      const data = {
        company_id: this.companyId,
        user_id: this.user.id,
        password: this.form.get('password').value,
      };
      try {
        const response: any = await this.service.resetPassword(data);
        this.gs.showToastSuccess(response?.message);
        this.close(true);
      } catch (error) {
        this.gs.showToastError(error.message);
        console.log(error)
      } finally {
        this.loading = false;
      }
    }
  }

  close(refresh = false) {
    this.ref.close(refresh);
  }

}

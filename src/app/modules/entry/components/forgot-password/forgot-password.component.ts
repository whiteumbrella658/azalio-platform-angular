import { Component,Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {NbDialogRef} from '@nebular/theme'
import { EntryService } from '../../entry.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { emailRegex } from 'src/constants';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup;
  @Input() title;
  loading: Boolean;

  constructor(private fb: FormBuilder,private ref:NbDialogRef<ForgotPasswordComponent>,
    private service: EntryService, private gs: GeneralService ) {

  }


  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['',[Validators.required, Validators.pattern(emailRegex)]]
    })
  }

  submit(ngForm) {
    if(ngForm.valid) {
      this.loading = true;
      this.forgotPassword();
    }
  }

  forgotPassword = async () => {
    const data = {
      "email": this.form.controls.email.value
    }

    try {
      const response: any = await this.service.forgotPassword(data);
      this.gs.showToastSuccess(response?.message);
    } catch (error) {
      this.gs.showToastError(error.message);
    } finally {
      this.loading = false;
      this.close();
    }
  }

  close() {
    this.ref.close();
  }

}

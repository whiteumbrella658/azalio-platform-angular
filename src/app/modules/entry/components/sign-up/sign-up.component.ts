import { Component, EventEmitter, Input, OnInit,Output,TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {NbDialogService} from '@nebular/theme'
import {NbDialogRef} from '@nebular/theme'
import { GeneralService } from 'src/app/core/services/general.service';
import { emailRegex } from 'src/constants';
import { EntryService } from '../../entry.service';
import {FirestoreService} from '../../../../core/services/firestore.service';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  form: FormGroup;

  showPassword = false;
  heardFromList = [
    { key: 0, value: "Newsletter"},
    { key: 1, value: "Search engine"},
    { key: 2, value: "Social media (LinkedIn etc.)"},
    { key: 3, value: "Webinar"},
    { key: 4, value: "Word of mouth"},
    { key: 5, value: "Other"},
  ]
  @Input() data;
  @Output() signUpSuccess: EventEmitter<null> = new EventEmitter<null>();
  loading: boolean;
  showCard: boolean;
  constructor(private router: Router, private fb: FormBuilder, public gs: GeneralService, private ref:NbDialogRef<SignUpComponent>,
    private service: EntryService, private analytics: FirestoreService,) {

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

  ngOnInit(): void {
    this.showCard = true;
    let phoneNumber, code;

    if (this.data && this.data.type === 'phone') {
      this.showCard = false;
      if (this.data.phone && this.data.phone?.includes('-')) {
        phoneNumber = this.data.phone.split('-');
        code = {code: '+' + phoneNumber[0]};
      }
    }

    this.form = this.fb.group({
      heardFrom: ['', [Validators.required, Validators.maxLength(32)] ],
      name: [this.data ? this.data.name: '', [Validators.required, Validators.maxLength(100)] ],
      email: [this.data ? this.data.landingEmail : '', [Validators.required, Validators.pattern(emailRegex), Validators.maxLength(100)]],
      countrycode: [code ? code: '', [Validators.required]],
      phone: [phoneNumber ? phoneNumber[1]: '', [Validators.pattern(/^\d{7,10}$/)] ],
      password: ['',[Validators.required,Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,25}$/)]],
    })

    if (this.data && this.data.type === 'phone') {
      this.form.controls.email.setValidators([]);
      this.form.controls.email.updateValueAndValidity();
      this.form.controls.heardFrom.setValidators([]);
      this.form.controls.heardFrom.updateValueAndValidity();
    } else {
      this.form.controls.phone.setValidators([]);
      this.form.controls.phone.updateValueAndValidity();
      this.form.controls.countrycode.setValidators([]);
      this.form.controls.countrycode.updateValueAndValidity();
    }
  }

  submit(ngForm) {
    if(ngForm.valid) {
      if (this.data?.type === 'phone') {
        this.registerUser();
        return;
      }
      this.registerAdmin();
    }
  }

  registerAdmin = async () => {
    this.analytics.logEvents('signup_admin');
    const data = {
      "heard_from": this.heardFromList.find(el => el.key === this.form.controls.heardFrom.value).value,
      "admin_name": this.form.controls.name.value,
      "admin_email_address": this.form.controls.email.value,
      "admin_password": this.form.controls.password.value,
    }

    try {
      this.loading = true;
      const response: any = await this.service.registerCompanyAdmin(data);
      this.gs.showToastSuccess(response?.message);
      setTimeout(()=> {
        const output = {key: 'verify_email', email: data.admin_email_address, name: data.admin_name, password: data.admin_password}
        this.close(output);
      }, 1000)
    } catch (error) {
      this.gs.showToastError(error.message);
    } finally {
      this.loading = false;
    }
  }

  registerUser = async () => {
    this.analytics.logEvents('signup_user');
    const data = {
      "name": this.form.controls.name.value,
      "phone": this.form.controls.phone.value ? this.form.controls.countrycode.value.code + this.form.controls.phone.value : '',
      "password": this.form.controls.password.value,
      "token": this.data.token,
      "email": this.data.email
    }

    try {
      this.loading = true;
      const response: any = await this.service.registerCompanyUser(data);
      this.gs.showToastSuccess(response?.message);
      // setTimeout(()=> {
      //   this.router.navigate(['home/login-page']);
      //   this.close(null);
      this.close(true);
      // }, 1500)
    } catch (error) {
      this.gs.showToastError(error.message);
    } finally {
      this.loading = false;
    }
  }

  close(openNext) {
    this.ref.close(openNext);
  }

  }


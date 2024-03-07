import { Component,Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EntryService } from '../../entry.service';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/core/services/general.service';
import { config } from 'src/environments/configuration';
import { countries } from 'src/constants';
import {FirestoreService} from '../../../../core/services/firestore.service';

@Component({
  selector: 'app-setup-page',
  templateUrl: './setup-page.component.html',
  styleUrls: ['./setup-page.component.scss']
})
export class SetupPageComponent implements OnInit {
  form: FormGroup;
  @Input() title;
  email: string;
  token: string;
  selectedCountry;
  countries: { code: string; img: string; }[];

  loading: boolean;
  name: string;
  isLinkValid: boolean;

  constructor(private gs: GeneralService, private fb: FormBuilder, private analytics: FirestoreService, private service: EntryService, private router: Router) {
    this.countries = countries.slice();
    // if (config.environment?.toLowerCase() === 'prod' || config.environment?.toLowerCase() === 'production') {
    //     this.countries = [this.countries[0]];
    // } else {
    //   this.countries = [this.countries[0], this.countries[1]];
    // }
  }

  ngOnInit(): void {
    this.selectedCountry = this.countries[0];
    this.form = this.fb.group({
      name: ['',[Validators.required, Validators.maxLength(100)]],
      phone_number: ['',[Validators.pattern(/^\d{7,10}$/), Validators.required]],
    });
    this.analytics.logEvents("company_registration_page");
    this.parseUrl();
  }

  parseUrl = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    this.email = urlParams.get('email');
    this.token = urlParams.get('token');
    this.name = urlParams.get('admin_name');

    if(!this.email || !this.token) {
      this.router.navigate(['']);
    }
    this.validateLink();
  }

  submit(ngForm) {
    this.analytics.logEvents("company_launch_button");
    if(ngForm.valid) {
      this.validateAdmin();
    }
  }

  validateLink = async () => {
    const data = {
      token: this.token,
      email: this.email
    }

    try {
      const response: any = await this.service.validateToken(data);
      if (response) {
        this.isLinkValid = true;
      }
    } catch (error) {
      this.isLinkValid = false;
    } finally {
      this.gs.hideSplashScreen();
    }
  }

  validateAdmin = async () => {
    const data = {
      "token": this.token, // will come from url
      "email": this.email, // will come from url
      "company_name": this.form.controls.name.value,
      "admin_phone_number": this.selectedCountry.code + this.form.controls.phone_number.value
    }

    try {
      this.loading = true;
      const response: any = await this.service.validateAdmin(data);
      this.gs.showToastSuccess(response?.message);
      setTimeout(() => {
        // this.router.navigate(['home'], { queryParams: { signIn: true}});
        this.router.navigate(['home/login-page']);
      }, 1000);
    } catch(error) {
      this.gs.showToastError(error.message);
    } finally {
      this.loading = false;
    }
  }
  addMobileTooltipAnalytics(){
    this.analytics.logEvents("hover_company_mobile_info");
  }
  navigate() {
    setTimeout(() => {
      this.router.navigate(['home/login-page']);
    }, 100);
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { GeneralService } from 'src/app/core/services/general.service';
import { SignUpComponent } from '../../components/sign-up/sign-up.component';
import { EntryService } from '../../entry.service';

@Component({
  selector: 'app-accept-invite-page',
  templateUrl: './accept-invite-page.component.html',
  styleUrls: ['./accept-invite-page.component.scss']
})
export class AcceptInvitePageComponent implements OnInit {
  email: string;
  token: string;
  name: string;
  companyName: any;
  phone: string;
  isRegistered: boolean;
  loading: boolean;
  isLinkValid: boolean;

  constructor(
    private service: EntryService,
    private route: ActivatedRoute,
    private gs: GeneralService, private dialogService: NbDialogService, private router: Router) {
    this.isRegistered = false;  
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.parseUrl();
      this.validateLink();
    });
  }

  parseUrl = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    this.email = urlParams.get('email');
    this.token = urlParams.get('token');
    this.name = urlParams.get('name');
    this.companyName = urlParams.get('companyname');
    this.phone = urlParams.get('phone');
    this.isRegistered = urlParams.get('isRegistered') ? true : false;

    if(!this.email || !this.token || !this.companyName) {
      this.router.navigate(['']);
    }
  }

  open() {
    const data = {type: 'phone', email: this.email, name: this.name, token: this.token, phone: this.phone};
    this.dialogService.open(SignUpComponent,{hasBackdrop: true, closeOnBackdropClick: false, context: {data: data}
    }).onClose.subscribe(success => {
      if (success == true) {
        this.isRegistered = true;
        this.router.navigate(['.'], { relativeTo: this.route, queryParams: { 'isRegistered': true }, queryParamsHandling: 'merge', skipLocationChange: false});
      }
    });
  }

  validateLink = async () => {
    const data = {
      token: this.token,
      email: this.email
    }

    try {
      this.loading = true;
      const response: any = await this.service.validateToken(data);
      if (response) {
        this.isLinkValid = true;
      }
    } catch (error) {
      this.isLinkValid = false;
      // this.gs.showToastError(error.message);
    } finally {
      this.loading = false;
      this.gs.hideSplashScreen();
    }
  }

  navigate() {
    setTimeout(() => {
      this.router.navigate(['/home/login-page']);
    },100);
  }

}

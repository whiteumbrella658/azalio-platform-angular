import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute } from '@angular/router';
import {ExternalPagesService} from 'src/app/core/services/external-pages.service'
import { GeneralService } from 'src/app/core/services/general.service';
import { AnyCnameRecord } from 'dns';
import { exit } from 'process';

@Component({
  selector: 'app-access-point',
  templateUrl: './access-point.component.html',
  styleUrls: ['./access-point.component.scss']
})
export class AccessPointComponent implements OnInit {

  loading: boolean;
  temp_token: any;
  //storePin: any;
  constructor(private router: Router,private route: ActivatedRoute, private service: ExternalPagesService, private gs: GeneralService,) { }
  
async storeToken () {
  try {
    this.gs.setExternalToken(this.temp_token);
    this.loading = true;
    const response: any = await this.service.tokenaccess(this.temp_token, true);
    this.gs.setExternalToken('');
    this.gs.setExternalToken(response?.token);
    this.gs.setWeekStartDay(response?.week_start_day);
    setTimeout(() => {
      this.router.navigate(['store-app-scheduler']);
    });
  } catch (error) {
    this.router.navigate(['store-app-scheduler/404']);
  } finally {
   // this.loading = false;
  }
}

  ngOnInit(): void {
    this.route.queryParamMap
    .subscribe(params => { 
    this.temp_token = params.get('token');
  });
    if (this.temp_token) {
      this.storeToken();
    } else {
      console.log('temp token not found.. re-route to page not found');
      this.router.navigate(['store-app-scheduler/404']);
    }
  }
}

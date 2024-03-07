import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExternalPagesService } from 'src/app/core/services/external-pages.service';
import { GeneralService } from 'src/app/core/services/general.service';

@Component({
  selector: 'app-acess-mobile-scheduler',
  templateUrl: './acess-mobile-scheduler.component.html',
  styleUrls: ['./acess-mobile-scheduler.component.scss']
})
export class AcessMobileSchedulerComponent implements OnInit {

  constructor(
    private gs: GeneralService,
    private service: ExternalPagesService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  tempToken: any;
  loading: boolean;

  async storeToken() {
    try {
      this.gs.setExternalToken(this.tempToken);
      this.loading = true;
      const response: any = await this.service.tokenaccess(this.tempToken, false);
      this.gs.setExternalToken('');
      this.gs.setExternalToken(response?.token);
      this.gs.setWeekStartDay(response?.week_start_day);
      setTimeout(() => {
        this.router.navigate(['mobile-scheduler']);
      });
    } catch (error) {
      console.log(error);
      this.router.navigate(['mobile-scheduler/404']);
    } finally {
      // this.loading = false;
    }
  }

  ngOnInit(): void {
    // route: http://localhost:4200/access-mobile-scheduler?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTg4LCJjb21wYW55X2lkIjo4OCwic3RvcmVfaWQiOjE3Mywid2Vla3NfZm9yX3NjaGVkdWxlcyI6MSwid2Vla19zdGFydF9kYXkiOjAsIndlZWtfc3RhcnRfZGF0ZSI6bnVsbCwiaWF0IjoxNjU1OTg1ODk4LCJleHAiOjE2NTU5ODU5NTh9.SOcN3OrCLRP-I-Sfuz6WqR_HCNi5W7gLTpB0ugTu94o
    this.route.queryParamMap
      .subscribe(params => {
        this.tempToken = params.get('token');
      });
    if (this.tempToken) {
      this.storeToken();
    } else {
      this.router.navigate(['mobile-scheduler/404']);
    }
  }
}

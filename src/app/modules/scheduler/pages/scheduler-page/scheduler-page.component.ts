import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/core/services/general.service';

@Component({
  selector: 'app-scheduler-page',
  templateUrl: './scheduler-page.component.html',
  styleUrls: ['./scheduler-page.component.scss']
})
export class SchedulerPageComponent implements OnInit {

  constructor(private gs: GeneralService) { }

  ngOnInit(): void {
    this.gs.hideSplashScreen();
    // this.dataService.getConfigurations(false).then((config) => {
    //   if (!config.role.modules?.Schedules?.enabled || config.company?.is_scheduler !== 1) {
    //     this.router.navigate(['401'])
    //   }
    // }).finally(() => {
    // });
  }

}

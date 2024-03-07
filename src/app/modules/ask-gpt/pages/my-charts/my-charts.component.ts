import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { AskGptService } from '../../ask-gpt.service';

@Component({
  selector: 'app-my-charts',
  templateUrl: './my-charts.component.html',
  styleUrls: ['./my-charts.component.scss']
})
export class MyChartsComponent implements OnInit {
  loading: boolean;
  graphs: any;

  constructor(
    private gs: GeneralService,
    private service: AskGptService,
    private router: Router,
    private dataService: DataSharedService,
    ) { }

  ngOnInit(): void {
    this.dataService.getConfigurations(false).then((config) => {
      if (config.company?.is_askq !== 1) {
          this.router.navigate(['401']) 
        return;
      }
    }).finally(() => {
      this.gs.hideSplashScreen();
      this.getSavedGraphs();
    });
  }

  removeGraph() {
    this.getSavedGraphs();
  }

  async getSavedGraphs() {
    try {
      this.loading = true;
      const response: any = await this.service.getSavedGraphs();
      this.graphs = response.graphs;
    } catch (error) {
      this.gs.showToastError(error.message);
      // console.log(error)
    } finally {
      this.loading = false;
    }
  }

}

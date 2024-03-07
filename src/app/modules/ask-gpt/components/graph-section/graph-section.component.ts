import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/core/services/general.service';
import { AskGptService } from '../../ask-gpt.service';

@Component({
  selector: 'app-graph-section',
  templateUrl: './graph-section.component.html',
  styleUrls: ['./graph-section.component.scss']
})
export class GraphSectionComponent implements OnInit {
  loading: boolean;
  graphs: any;

  constructor(
    private gs: GeneralService, 
    private service: AskGptService
    ) { }

  ngOnInit(): void {
    this.getHomePageGraphs();
  }

  async getHomePageGraphs() {
    try {
      this.loading = true;
      const response: any = await this.service.getHomePageGraphs();
      this.graphs = response.graphs;
    } catch (error) {
      this.gs.showToastError(error.message);
      console.log(error)
    } finally {
      this.loading = false;
    }
  }

}

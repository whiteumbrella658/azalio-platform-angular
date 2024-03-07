import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/core/services/general.service';

@Component({
  selector: 'app-tasks-page',
  templateUrl: './tasks-page.component.html',
  styleUrls: ['./tasks-page.component.scss']
})
export class TasksPageComponent implements OnInit {

  constructor(private gs: GeneralService) { }

  ngOnInit(): void {
    this.gs.hideSplashScreen();
  }

}

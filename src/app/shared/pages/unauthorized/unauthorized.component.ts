import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/core/services/general.service';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss']
})
export class UnauthorizedComponent implements OnInit {

  constructor(private gs: GeneralService) { }

  ngOnInit(): void {
    this.gs.hideSplashScreen();
  }

}

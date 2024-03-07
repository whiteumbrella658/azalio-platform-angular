import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/core/services/general.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {

  constructor(private gs: GeneralService) { }

  ngOnInit(): void {
   this.gs.hideSplashScreen();
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { GeneralService } from 'src/app/core/services/general.service';

@Component({
  selector: 'app-automation-details',
  templateUrl: './automation-details.component.html',
  styleUrls: ['./automation-details.component.scss']
})
export class AutomationDetailsComponent implements OnInit {
  @Input() data: Object;
  @Input() storeTimezone: any;

  constructor(
    private gs: GeneralService,
    private ref: NbDialogRef<AutomationDetailsComponent>,
  ) {
    this.storeTimezone = this.storeTimezone;
   }

  ngOnInit(): void {
  }

  changeTimezone(time) {
    return this.gs.changeTimezone(new Date(time), this.storeTimezone)
  }

  close(openNext): void {
    this.ref.close(openNext);
  }

}

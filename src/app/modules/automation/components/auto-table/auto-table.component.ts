import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { AutomationService } from '../../automation.service';
import { AutomationDetailsComponent } from '../automation-details/automation-details.component';

@Component({
  selector: 'app-auto-table',
  templateUrl: './auto-table.component.html',
  styleUrls: ['./auto-table.component.scss']
})
export class AutoTableComponent implements OnInit, OnChanges {
  displayedColumns: string[] = ['automation', 'action'];
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  loading: boolean;

  @Input() regionId: any;
  storeTimezone: any;
  emptyResults: any;

  constructor(
    private router: Router,
    private dataService: DataSharedService,
    private service: AutomationService,
    private gs: GeneralService,
    private dialogService: NbDialogService
  ) { 
  }

  ngOnInit(): void {
    this.dataService.getConfigurations(false).then((config) => {
      if (!config.role.modules?.AutomationManagement?.enabled) {
        this.router.navigate(['401'])
      }
    }).finally(() => {
      this.regionId = this.regionId;
      this.getData();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.regionId && changes.regionId.currentValue !== changes.regionId.previousValue) {
      this.regionId = changes.regionId.currentValue;
      this.getData();
    }
  }

  changeTimezone(time) {
    return this.gs.changeTimezone(new Date(time), this.storeTimezone)
  }

  async getData() {
    if (!this.regionId || this.regionId == 0) {
      return;
    }
    try {
      this.loading = true;
      const response: any = await this.service.getAutomationData(this.regionId);
      this.dataSource.data = response?.automation_data;
      this.storeTimezone = response?.store_timezone;
      this.emptyResults = this.dataSource.data?.length === 0 ? true : false;
      // this.gs.showToastSuccess(response?.message);
    } catch (error) {
      this.gs.showToastError(error.message);
      console.log(error)
    } finally {
      this.loading = false;
    }
    // this.dataSource.data = [
    //   {
    //     id: 122, store: null, user: { name: 'Eman Fatima', id: 1 }, all_schedules: 0, schedule_start_time: null, schedule_end_time: null, request_confirmation_before_hours: 1,
    //     send_response_by_hours: 0.5, run_until: '12:00:00', creation_date: '12:00:00', is_expired: 0, is_paused: 1
    //   },
    //   {
    //     id: 123, store: { name: 'Leonardtown', id: 33 }, user: null, all_schedules: 1, schedule_start_time: '12:00:00', schedule_end_time: '12:00:00', request_confirmation_before_hours: 1,
    //     send_response_by_hours: 0.5, run_until: '12:00:00', creation_date: '12:00:00', is_expired: 1, is_paused: 0
    //   },
    //   {
    //     id: 123, store: { name: 'Leonardtown', id: 33 }, user: null, all_schedules: 1, schedule_start_time: '12:00:00', schedule_end_time: '12:00:00', request_confirmation_before_hours: 1,
    //     send_response_by_hours: 0.5, run_until: '12:00:00', creation_date: '12:00:00', is_expired: 0, is_paused: 0
    //   }
    // ]
  }

  async proceed(elem, isStart) {
    //call API to update automation status;
    const data = {
      is_paused: isStart ? true : false,
      id: elem.id
    }
    try {
      this.loading = true;
      const response: any = await this.service.updateAutomationStatus(data);
      this.gs.showToastSuccess(response?.message);
      this.getData();
    } catch (error) {
      this.gs.showToastError(error.message);
      console.log(error)
    } finally {
      this.loading = false;
    }
  }

  openDetailsModal(data) {
    this.dialogService.open(AutomationDetailsComponent, {
      hasBackdrop: true,
      closeOnBackdropClick: false,
      context: { data: data, storeTimezone: this.storeTimezone },
    }).onClose.subscribe((item) => {
      if (item) {
        // this.getData(); // call child components getData.
      }
    });
  }

}

export interface PeriodicElement {
}


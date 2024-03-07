import { OnDestroy, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { TimesheetService } from '../../timesheet.service';
import { NbDialogService, NbPopoverDirective } from '@nebular/theme';
import { TimesheetDailyViewComponent } from '../../components/timesheet-daily-view/timesheet-daily-view.component';
import { TimesheetWeeklyViewComponent } from '../../components/timesheet-weekly-view/timesheet-weekly-view.component';
import {FirestoreService} from 'src/app/core/services/firestore.service';
import { AddTimesheetEntryComponent } from '../../components/add-timesheet-entry/add-timesheet-entry.component';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-timesheet-page',
  templateUrl: './timesheet-page.component.html',
  styleUrls: ['./timesheet-page.component.scss'],
})
export class TimesheetPageComponent implements OnInit, OnDestroy {
  @ViewChild(NbPopoverDirective) popover: NbPopoverDirective;
  @ViewChild(TimesheetDailyViewComponent)
  dailyComponent: TimesheetDailyViewComponent;
  @ViewChild(TimesheetWeeklyViewComponent)
  weeklyComponent: TimesheetWeeklyViewComponent;
  sidebarOpened: boolean = false;
  selectedTab: any;
  searchOn: string;
  filterOn: any;
  showHelperButton: boolean;
  showFilterResponsive: boolean;
  nameConfig: any;
  exportRange: any;
  loading: any;
  selectedDate: any;
  startDay: any;
  selectedDateWeekly: { start: Date; end: Date; };
  userPreferences: any;
  totalRegion:number;
  subscription:any;
  sharedRegion:number;
  isButtonPressed: boolean = false;
  exportForm: FormGroup;
  storeGroupList: any;
  roles: any;
  constructor(
    private fb: FormBuilder,
    private router: Router, private gs: GeneralService, private dataService: DataSharedService, private service: TimesheetService, private analytics: FirestoreService,
    private dialogService: NbDialogService,) {
    this.subscription=dataService.SharingRegionData.subscribe((res: any) => {
      this.sharedRegion = res;
    })
    this.dataService.getStoreGroups(false).then((groups) => {
      this.storeGroupList = groups;
    });
    this.dataService.getRoles(false).then((roles) => {
      this.roles = roles;
    }).finally(() => { });
   }

  ngOnInit(): void {
    this.exportForm = this.fb.group({
        selectedStoreGroup: [''],
        selectedRole: []
    });

    this.selectedDate = new Date();
    this.exportRange = null;
    this.showFilterResponsive = false;
    this.dataService.getConfigurations(false).then((config) => {
      if (!config.role.modules?.TimesheetManagement?.enabled) {
        this.router.navigate(['401'])
      }
      this.nameConfig = config.company?.custom_names;
      this.startDay = config.company.timesheet?.week_start_day;
      if (this.startDay == null || (this.startDay && this.startDay > 6 || this.startDay < 0)) {
        this.startDay = 0;
      }
      this.gs.hideSplashScreen();
    }).finally(() => {
      this.selectedTab = 'daily';
      this.selectedDateWeekly = this.gs.getWeek(new Date(), this.startDay);
    });
    // this.gs.hideSplashScreen();
  }

  setDateWeekly(date) {
    if (this.startDay !== null) {
      this.selectedDateWeekly = this.gs.getWeek(date.start, this.startDay);
      // this.picker.hide();
      this.weeklyComponent.setDateData(this.selectedDateWeekly);
    }

  }

  setPickerDate(date, storeStartDay) {
    this.startDay = storeStartDay;
    if (this.startDay !== null) {
      this.selectedDateWeekly = this.gs.getWeek(date.start, this.startDay);
    }
  }

  initAddEntry() {
     this.dialogService.open(AddTimesheetEntryComponent,{hasBackdrop: true, closeOnBackdropClick: false, context: {user: null, selectedData: null, timesheetData: null,}
     }).onClose.subscribe(refresh => {
       if (refresh) {
        this.isButtonPressed = true
       }
    });
  }

  setTab(state) {
    if (state == this.selectedTab) {
      return;
    }
    this.selectedTab = state;
    if (state === 'daily') {
      this.selectedDate = new Date();
    } else {
      this.selectedDateWeekly = this.gs.getWeek(new Date(), this.startDay);
    }
  }

  onSearch(searchText) {
    this.gs.logEvents('search_timesheet')
    this.searchOn = searchText.trim();
  }

  onSearchAll(searchText) {
    this.searchOn = searchText.trim();
  }


  setDate(date) {
    this.selectedDate = date;
    this.dailyComponent.getData(date);
  }

  exportSummaryReport() {
    this.analytics.logEvents("summary_report");
    this.loading = true;
    this.popover.hide();
    const data = {
      startDate: this.gs.convertToLocalDateString(this.exportRange.start),
      endDate: this.gs.convertToLocalDateString(this.exportRange.end),
      regionId: this.sharedRegion,
      teamId: this.filterOn?.team_id,
      search: this.searchOn,
      store_group_id: this.exportForm.controls.selectedStoreGroup.value,
      role: this.exportForm.controls.selectedRole.value
    };

    console.log(data);

    this.service.exportSummaryReport(data)
      .then((response: any) => {
        this.exportRange = null;
        this.gs.exportAsExcelFile(response.csvData, "Summary Report");
      })
      .catch((error) => {
        this.gs.showToastError(error.message);
        console.log(error);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  exportDetailedReport() {
    this.analytics.logEvents("detailed_report");
    this.loading = true;
    this.popover.hide();
    const data = {
      startDate: this.gs.convertToLocalDateString(this.exportRange.start),
      endDate: this.gs.convertToLocalDateString(this.exportRange.end),
      regionId: this.sharedRegion,
      teamId: this.filterOn?.team_id,
      search: this.searchOn,
      store_group_id: this.exportForm.controls.selectedStoreGroup.value,
      role: this.exportForm.controls.selectedRole.value
    };

    this.service.exportDetailedReport(data)
      .then((response: any) => {
        this.exportRange = null;
        this.gs.exportAsExcelFile(response.csvData, "Detailed Report");
      })
      .catch((error) => {
        this.gs.showToastError(error.message);
        console.log(error);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  ngOnDestroy() {
		this.subscription?.unsubscribe();
	  }
}

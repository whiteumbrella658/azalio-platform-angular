import { Component, Input, OnInit, SimpleChanges, ViewChild, OnChanges, OnDestroy, EventEmitter, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { TimesheetService } from '../../timesheet.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { avatarOpacity, pageSizeOptions, paginatorOptions } from 'src/constants';
import { AddTimesheetEntryComponent } from '../add-timesheet-entry/add-timesheet-entry.component';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { NbDialogService } from '@nebular/theme';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-timesheet-weekly-view',
  templateUrl: './timesheet-weekly-view.component.html',
  styleUrls: ['./timesheet-weekly-view.component.scss']
})

export class TimesheetWeeklyViewComponent implements OnInit, OnChanges, OnDestroy {
  [x: string]: any;
  displayedColumns: string[] = ['user', 'region_title', 'sun', 'mon', 'tues', 'wed', 'thurs', 'fri', 'sat', 'total'];
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  selectedDate: any = {
    start: null,
    end: null
  }
  @Input() searchText;
  @Input() filterData;
  @Input() buttonPressed: any;
  @Output() weekStartChanged: EventEmitter<any> = new EventEmitter();
  data: any;
  pageEvent: PageEvent;
  selectedUser: any;
  showSideBarEntry: boolean;
  selectedRowData: any;
  timesheetData: any;
  pageSizes: any;
  showRegion: boolean;
  userSelectedDate: Date = new Date();
  // picker: NbDatepicker<Date>;

  @ViewChild(AddTimesheetEntryComponent) AddTimesheetEntryComponentInstance: AddTimesheetEntryComponent;
  paginator: any;
  weekDates: any;
  filterInput: any;
  showSideBarDetails: boolean;
  loading: boolean;
  emptySearchResults: boolean;
  emptyResults: boolean;
  startDay: number;
  weeksArr: any[];
  opacity: number;
  sharedRegion: number;
  subscription: any;
  isLocationEnabled: boolean;
  filters: any = { role: null, name_sort: 0, actual_hours_sort: 0 };
  isFiltered: { role: boolean };
  roles: any;
  form: FormGroup;
  defaultOpen: boolean = true;
  storeLevelSettings: boolean;
  companyWeekStartDay;

  constructor(private fb: FormBuilder, private dialogService: NbDialogService, private router: Router, private dataService: DataSharedService, private service: TimesheetService, public gs: GeneralService) {
    this.paginator = paginatorOptions;
    this.pageSizes = pageSizeOptions;
    this.dataService.getConfigurations(false).then((config) => {
      this.storeLevelSettings = config.company?.store_level_settings == 1 ? true : false;
      this.isLocationEnabled = config.company?.is_location === 1 ? true : false;
      this.companyWeekStartDay = config.company.timesheet?.week_start_day;
      this.startDay = this.companyWeekStartDay;
      // if (this.startDay == null || (this.startDay && this.startDay > 6 || this.startDay < 0)) {
      //   this.startDay = 0;
      // }
    }).finally(() => {
      this.storeLevelSettings ? this.updateConfig(this.sharedRegion) : this.setColumns();
    });

    this.subscription = this.dataService.SharingRegionData.subscribe((res: any) => {
      this.storeLevelSettings ? this.updateConfig(res) : '';
      this.sharedRegion = res;
      if (!this.storeLevelSettings) {
        this.getData();
      }
      this.closeDetails();
    });

    this.dataService.getRoles(false).then((roles) => {
      this.roles = roles;
    }).finally(() => {
    });

    this.form = this.fb.group({
      role: [],
    })

  }

  setColumns() {
    this.weeksArr = this.gs.getWeeksArray(this.startDay);
    this.displayedColumns = [...['user'], ...['region_title'], ...this.weeksArr, ...['total']];
    this.selectedDate = this.gs.getWeek(new Date(), this.startDay);
    this.weekDates = this.gs.getWeekDates(this.selectedDate.start);
    this.getData();
  }

  updateConfig(regionId) {
    this.loading = true;
    this.dataService.getRegionConfig(true, regionId).then((config) => {
      this.startDay = config.week_start_day === null ? this.companyWeekStartDay : config?.week_start_day;
    }).finally(() => {
      this.setColumns();
      let storeNewInfo = {
        newDate: { start: this.weekDates[0] },
        newDay: this.startDay
      };
      this.weekStartChanged.emit(storeNewInfo); // for datePicker
      this.loading = false;
    });
  }

  ngOnInit(): void {
    this.isFiltered = { role: null };
    this.filtersCopy = JSON.parse(JSON.stringify(this.filters));
    this.filters.name_sort = 1;
    this.opacity = avatarOpacity;
    this.showSideBarDetails = false;
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchText'] && changes.searchText.currentValue !== changes.searchText.previousValue) {
      if (this.pageEvent) {
        this.pageEvent.pageIndex = 0;
      }
      this.getData();
    } else if (changes['filterData'] && changes.filterData.currentValue !== changes.filterData.previousValue) {
      this.filterInput = changes.filterData.currentValue;
      this.getData();
    } else if (changes['buttonPressed'] && changes.buttonPressed.currentValue == true) {
      this.getData();
    }
  }

  setDateData(date) {
    this.selectedDate = date;
    this.weekDates = this.gs.getWeekDates(this.selectedDate.start);
    this.getData();
  }

  closeFilter(key) {
    this.form.controls[key].setValue(this.filters?.[key]);
  }

  applyFilterMulti(key) {
    this.gs.logEvents('weekly_timesheet_enteries_filtered_by_' + key)
    let val = this.form.controls[key].value;
    if (val && val.length > 0) {
      this.isFiltered[key] = true;
      this.filters[key] = val;
    } else {
      this.filters[key] = null;
      this.isFiltered[key] = false;
    }
    this.getData();
  }

  removeFilter(key) {
    this.filters[key] = null;
    this.isFiltered[key] = false;
    this.getData();
  }

  onSort(val, key) {
    this.gs.logEvents('timesheet_weekly_' + key);
    let role = this.filters.role;
    this.filters = JSON.parse(JSON.stringify(this.filtersCopy));
    this.filters[key] = val;
    this.filters.role = role;
    this.getData();
  }


  onEditClick(data) {    
    this.timesheetData = data;
    let tempUser = { ...this.selectedUser };
    this.selectedUser = null;
    tempUser['date'] = this.userSelectedDate;
    this.selectedUser = tempUser;
    this.showSideBarDetails = false;
    // this.showSideBarEntry = true;
    // this.gs.showBackDrop(true);
    this.dialogService.open(AddTimesheetEntryComponent, {
      hasBackdrop: true, closeOnBackdropClick: false, context: { user: this.selectedUser, selectedData: this.selectedRowData, timesheetData: this.timesheetData }
    }).onClose.subscribe(refresh => {
      this.selectedRowData = null;
      if (refresh) {
        this.getData();
      }
    });
  }

  onAddClick() {
    this.showSideBarDetails = false;
    this.dialogService.open(AddTimesheetEntryComponent, {
      hasBackdrop: true, closeOnBackdropClick: false, context: { user: this.selectedUser, selectedData: this.selectedRowData, timesheetData: this.timesheetData }
    }).onClose.subscribe(refresh => {
      if (refresh) {
        this.getData();
      }
    });
  }
  initAddEntry() {
    // const selectedUser = {date: this.selectedDate, userName: data.user_name, userId: data.user_id, userColor: data.user_color, userRole: data.role_title};
    this.dialogService.open(AddTimesheetEntryComponent, {
      hasBackdrop: true, closeOnBackdropClick: false, context: { user: null, selectedData: null, timesheetData: null }
    }).onClose.subscribe(refresh => {
      if (refresh) {
        this.getData();
      }
    });
  }

  selectItem(element, day) {
    element.is_empty = !(Object.keys(element.days).some(key => key.toLowerCase().includes(day)))
    if (element.is_empty) {
      return;
    }
    this.showSideBarDetails = true;
    const date = this.weekDates[this.weeksArr.indexOf(day)];
    element['date'] = this.gs.convertToLocalDateString(date);
    this.selectedRowData = element;
    this.userSelectedDate = date;
    this.selectedUser = { userName: element.user_name, userId: element.user_id, userColor: element.user_color, userRole: element.role_title };
    this.gs.showBackDrop(true);
  }

  // closeAddEntrySidebar = () => {
  //   this.showSideBarEntry = false; 
  //   this.AddTimesheetEntryComponentInstance.resetForm();
  //   this.gs.showBackDrop(false);
  // }

  closeDetails() {
    this.showSideBarDetails = false;
    this.selectedRowData = null;
    this.gs.showBackDrop(false);
  }

  getData() {
    if (this.sharedRegion != null) {
      this.filterInput = { 'region_id': this.sharedRegion };
      this.loading = true;
      this.service.getTimesheetTableData(this.searchText, this.pageEvent, this.filterInput,
        this.gs.convertToLocalDateString(this.selectedDate.start), this.gs.convertToLocalDateString(this.selectedDate.end), this.filters)
        .then((response) => {
          this.dataSource = response.users;
          this.paginator = response.pagination;
          this.emptySearchResults = response.users?.length === 0 && this.searchText ? true : false;
          this.emptyResults = response.users?.length === 0 && !this.searchText ? true : false;
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}


export interface PeriodicElement {
  user: string;
  total: number;
  sun: string;
  mon: string;
  tues: string;
  wed: string;
  thurs: string;
  fri: string;
  sat: string
}


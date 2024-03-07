import { AfterViewChecked, ChangeDetectorRef, Component, Input, OnInit, SimpleChanges, ViewChild, OnChanges, OnDestroy } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NbDialogService, NbSidebarService, NbTreeGridService } from '@nebular/theme';
import { GeneralService } from 'src/app/core/services/general.service';
import { TimesheetService } from '../../timesheet.service';
import { avatarOpacity, pageSizeOptions, paginatorOptions } from 'src/constants';
import { MapsService } from 'src/app/core/services/maps.service';
import { Router } from '@angular/router';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { AddTimesheetEntryComponent } from '../add-timesheet-entry/add-timesheet-entry.component';
import { FormBuilder } from '@angular/forms';


// import e from 'express';
// import { ConditionalExpr } from '@angular/compiler';
declare var google: any;
var geocoder = new google.maps.Geocoder();
@Component({
  selector: 'app-timesheet-daily-view',
  templateUrl: './timesheet-daily-view.component.html',
  styleUrls: ['./timesheet-daily-view.component.scss'],
})


export class TimesheetDailyViewComponent implements OnInit, AfterViewChecked, OnChanges, OnDestroy {
  displayedColumns: string[] = ['username', 'region_title', 'firstclockin', 'lastclockout', 'worktime', 'breaktime', 'totaltime'];
  fix
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  date = new Date();
  @ViewChild(AddTimesheetEntryComponent) AddTimesheetEntryComponentInstance: AddTimesheetEntryComponent;
  @ViewChild(MatPaginator) MatPaginator: MatPaginator;
  @Input() searchText;
  @Input() filterData: any;
  @Input() buttonPressed: any;
  selectedDate: Date = new Date();
  data: any;
  paginator: any;
  pageEvent: PageEvent;
  selectedUser: any;
  showSideBarEntry: boolean;
  selectedRowData: any;
  timesheetData: any;
  pageSizes: any;
  loading: boolean;
  filterInput: any;
  showSideBarDetails: boolean;
  emptySearchResults: boolean;
  emptyResults: boolean;
  nameConfig: any;
  isLocationEnabled: any;
  opacity: number;
  selectedFilter: any;
  sharedRegion: number;
  subscription: any;
  filters: any = { role: null, name_sort: 0, checkin_sort: 0, checkout_sort: 0, logged_hours_sort: 0, break_hours_sort: 0, actual_hours_sort: 0 };
  // filters: { role: any; email: string, phone: string, name_sort: Number };
  isFiltered: { role: boolean };
  filtersCopy: any;
  form: any;
  roles: void;
  defaultOpen: boolean = true;
  constructor(private dialogService: NbDialogService, private fb: FormBuilder,
    private dataService: DataSharedService,
    private gm: MapsService, private sidebarService: NbSidebarService,
    private cdRef: ChangeDetectorRef, private service: TimesheetService,
    public gs: GeneralService, private router: Router) {
    this.pageSizes = pageSizeOptions;
    this.dataService.getConfigurations(false).then((config) => {
      this.nameConfig = config.company?.custom_names;
      this.isLocationEnabled = config.company?.is_location === 1 ? true : false;
    }).finally(() => {
    });
    this.loading = true;
    this.subscription = dataService.SharingRegionData.subscribe((res: any) => {
      this.sharedRegion = res;
      this.closeDetails();
      this.getData();
    })
    this.dataService.getRoles(false).then((roles) => {
      this.roles = roles;
    }).finally(() => {
    });

    this.form = this.fb.group({
      role: [],
    })
  }

  closeFilter(key) {
    this.form.controls[key].setValue(this.filters?.[key]);
  }

  applyFilterMulti(key) {
    this.gs.logEvents('daily_timesheet_enteries_filtered_by_' + key)
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

  ngOnInit(): void {
    this.isFiltered = { role: null };
    this.filtersCopy = JSON.parse(JSON.stringify(this.filters));
    this.filters.checkin_sort = -1;
    this.loading = true;
    this.opacity = avatarOpacity;
    this.paginator = paginatorOptions;
    this.selectedDate = new Date();
    this.selectedUser = null;
    this.showSideBarEntry = false;
    this.showSideBarDetails = false;
    this.emptyResults = false;
    this.emptySearchResults = false;
    this.gs.showBackDrop(false);
  }

  onSort(val, key) {
    this.gs.logEvents('timesheet_daily_' + key);
    let role = this.filters.role;
    this.filters = JSON.parse(JSON.stringify(this.filtersCopy));
    this.filters[key] = val;
    this.filters.role = role;
    this.getData();
  }

  async getAddress(element, latlng, key) {
    if (element[key]) {
      return element[key];
    }

    try {
      const response = await geocoder.geocode({ location: latlng });
      if (response && response.results && response.results[0]) {
        let tooltip = '';
        if (key === 'formatted_address_clockin' && element.is_outof_radius_start) {
          tooltip = "Out of geo-fence.\u00A0 \u00A0 \u00A0 \u00A0 \u00A0 Location: "
        } else if (key === 'formatted_address_clockout' && element.is_outof_radius_end) {
          tooltip = "Out of geo-fence.\u00A0 \u00A0 \u00A0 \u00A0 \u00A0 Location: ";
        }

        element[key] = tooltip + response.results[0].formatted_address;
      }
    } catch (error) {
      setTimeout(() => {
        this.getAddress(element, latlng, key);
      }, 1000);

    } finally {
    }
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchText'] && changes.searchText.currentValue !== changes.searchText.previousValue) {
      if (this.pageEvent) {
        this.pageEvent.pageIndex = 0;
      }
      this.getData();
    }
    else if (changes['filterData'] && changes.filterData.currentValue !== changes.filterData.previousValue) {
      this.filterInput = changes.filterData.currentValue;
      this.getData();
    } else if (changes['buttonPressed'] && changes.buttonPressed.currentValue == true) {
      this.getData();
    }
    this.selectedFilter = this.dataService.getSelectedFilter();
  }



  initAddEntry() {
    // const selectedUser = {date: this.selectedDate, userName: data.user_name, userId: data.user_id, userColor: data.user_color, userRole: data.role_title};
    this.dialogService.open(AddTimesheetEntryComponent, {
      hasBackdrop: true, closeOnBackdropClick: false, context: { user: null, selectedData: null, timesheetData: null, }
    }).onClose.subscribe(refresh => {
      if (refresh) {
        this.getData();
      }
    });
  }

  toggle() {
    this.sidebarService.toggle(false, 'detail');
  }

  onEditClick(data) {
    this.timesheetData = data;
    let tempUser = { ...this.selectedUser };
    this.selectedUser = null;
    tempUser['date'] = this.selectedDate;
    this.selectedUser = tempUser;
    this.showSideBarDetails = false;
    this.dialogService.open(AddTimesheetEntryComponent, {
      hasBackdrop: true, closeOnBackdropClick: false, context: { user: this.selectedUser, selectedData: this.selectedRowData, timesheetData: this.timesheetData }
    }).onClose.subscribe(refresh => {
      if (refresh) {
        this.getData();
      }
    });
    // this.showSideBarEntry = true;
    // this.gs.showBackDrop(true);
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

  selectRow(element) {
    if (element.is_empty) {
      return;
    }
    this.showSideBarDetails = true;
    this.selectedRowData = element;
    this.selectedUser = { userName: element.user_name, userId: element.user_id, userColor: element.user_color, userRole: element.role_title };
    this.gs.showBackDrop(true);
  }

  getData(date: any = null) {
    if (this.sharedRegion != null) {
      this.filterInput = { 'region_id': this.sharedRegion }

      if (date) {
        this.selectedDate = date;
      }
      this.loading = true;
      this.service.getTimesheetTableData(this.searchText, this.pageEvent, this.filterInput, this.gs.convertToLocalDateString(this.selectedDate), this.gs.convertToLocalDateString(this.selectedDate), this.filters)
        .then((response) => {
          this.dataSource.data = response.users;
          this.paginator = response.pagination;
          this.emptySearchResults = response.users?.length === 0 && this.searchText ? true : false;
          this.emptyResults = response.users?.length === 0 && !this.searchText ? true : false;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }

  closeAddEntrySidebar = () => {
    this.showSideBarEntry = false;
    this.AddTimesheetEntryComponentInstance.resetForm();
    this.gs.showBackDrop(false);
  }

  onFormSuccess() {
    this.getData();
    this.showSideBarEntry = false;
    this.gs.showBackDrop(false);
  }

  closeDetails() {
    this.showSideBarDetails = false;
    this.selectedRowData = null;
    this.gs.showBackDrop(false);
  }
  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}

export interface PeriodicElement {
  user: string;
  position: number;
  firstclockin: number;
  firstclockout: string;
  totaltime: string
  breaktime: string;
  worktime: string;
}


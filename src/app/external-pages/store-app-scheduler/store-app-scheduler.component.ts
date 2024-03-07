import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ChangeDetectorRef, AfterViewChecked, Input} from '@angular/core';
import { momentTimezone, Notifications, MbscFormsModule, MbscDatepicker } from '@mobiscroll/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import {ExternalPagesService} from '../../core/services/external-pages.service';

momentTimezone.moment = moment;

import moment from 'moment-timezone';
import {
  formatDate,
  MbscCalendarEvent,
  MbscDatepickerOptions,
  MbscEventcalendarOptions,
  MbscEventcalendarView,
  MbscPopup,
  MbscPopupOptions,
  setOptions,
} from '@mobiscroll/angular';

setOptions({
  theme: 'windows',
  themeVariant: 'light',
  clickToCreate: false,
  dragToCreate: false,
  dragToMove: false,
  dragToResize: false,
  // timezonePlugin: momentTimezone,
  // dataTimezone: 'utc',
  // displayTimezone: 'local',
});

const days = [
  {
    name: 'Sun',
    value: 'SU',
    checked: false,
  },
  {
    name: 'Mon',
    value: 'MO',
    checked: false,
  },
  {
    name: 'Tue',
    value: 'TU',
    checked: false,
  },
  {
    name: 'Wed',
    value: 'WE',
    checked: false,
  },
  {
    name: 'Thu',
    value: 'TH',
    checked: false,
  },
  {
    name: 'Fri',
    value: 'FR',
    checked: false,
  },
  {
    name: 'Sat',
    value: 'SA',
    checked: false,
  },
];

import { GeneralService } from 'src/app/core/services/general.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';
import { NbDialogService } from '@nebular/theme';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { avatarOpacity, jobOpacity } from 'src/constants';

@Component({
  selector: 'app-store-app-scheduler',
  templateUrl: './store-app-scheduler.component.html',
  styleUrls: ['./store-app-scheduler.component.scss']
})
export class StoreAppSchedulerComponent implements OnInit, AfterViewChecked {
    @ViewChild('picker', { static: false })
    pickerInst: MbscDatepicker;
    @ViewChild('untilPicker', { static: false })
    untilPickerInst: MbscDatepicker;
    // Template driven form
    @ViewChild('templateForm')
    templateForm: any;
    templateSubmitted = false;
    nameConfig: any;
    job = null;
    storeApp: boolean;
    isNewEvent: boolean;
    title: any;
    participants: any;
    anchor: any;
    allEvents: MbscCalendarEvent[];
    popEventSelectedJob: any;
    showFilterResponsive: boolean;
    filterOn: any;
    showHelperButton: boolean;
    searchContext: boolean;
    showJobsFilter: boolean;
    public momentPlugin = momentTimezone;
    zoom: boolean;
    searchOn: any;
    loading: boolean;
    selection: SelectionModel<any>;
    selectAll: boolean;
    jobSearchText: any;
    jobsDropdown: any;
    displayAllJobs: boolean;
    selectedScheduleId: any;
    calendarStartDate: string;
    calendarEndDate: string;
    maxDate: Date;
    minDate: Date;
    cancelRecurrenceUpdate: boolean;
    weeksArray: any;
    minUntilDate: any;
    weekStartDay: number = 0;
    weekEndDay: number = 6;
    pageLoading: boolean;
    participantData: any[];
    prefShowRegionFilter: boolean;
    different: { less: boolean };
    pausedEvent: any = null
    pausedRecurringEvent: any;
    dateInput = '';
    selectedDate: any = [];
    opacity: number;
    // different: { less: boolean; };
  
    constructor(
      // private dialogService: NbDialogService,
      // private dataService: DataSharedService,
      private cdRef: ChangeDetectorRef,
      // private router: Router,
      // private notify: Notifications,
      private gs: GeneralService,
      // private http: HttpClient,
      // private cd: ChangeDetectorRef,
      private service: ExternalPagesService,
    ) {
      this.weekDays = JSON.parse(JSON.stringify(days));
    }
    myEvents: MbscCalendarEvent[] = [];
    view: any;
    calView: MbscEventcalendarView;
    @ViewChild('popup', { static: false })
    popup!: MbscPopup;
    popupEventTitle: string | undefined;
    popupEventDescription = '';
    popupEventAllDay = false;
    popupEventDates: any;
    // popupEventStatus = 'busy';
    calendarSelectedDate: any = new Date();
  
    switchLabel: any = 'All-day';
    myResources = [];
    myInvalids = [];
    repeatData = [
      {
        value: 'norepeat',
        text: 'No',
      },
      {
        value: 'custom',
        text: 'Yes',
      },
    ];
    usersList = [];
  
    repeatDataJobs = [];
    weekDays: any;
    selectedRepeat = '1';
    selectedRepeatJobs = '1';
    selectResponsive = {
      xsmall: {
        touchUi: true,
      },
      small: {
        touchUi: false,
      },
    };
    showCustomRepeat = false;
  
    selectedMonth = 1;
    untilDate: any;
    occurrences = 1;
    condition = 'until';
    tempEvent: any;
    calendarOptions: MbscEventcalendarOptions = {   
      clickToCreate: false,
      dragToCreate: false,
      dragToMove: false,
      dragToResize: false,
    firstDay: 0,
      view: {
        timeline: {
          type: 'week',
          timeCellStep: 120,
          timeLabelStep: 120,
          size: 2,
      }
      },
      timezonePlugin: momentTimezone,
      dataTimezone: 'utc',
      displayTimezone: 'local',
      

    };
    datePickerControls = ['date'];
    datePickerResponsive: any = {
      medium: {
        controls: ['calendar'],
        touchUi: false,
      },
    };
    datetimePickerControls = ['datetime'];
    datetimePickerResponsive = {
      medium: {
        controls: ['calendar', 'time'],
        touchUi: false,
      },
    };
    datePickerOptions: MbscDatepickerOptions = {
      select: 'range',
      showRangeLabels: false,
      touchUi: true,
    };
    isEdit = false;

    getPlaceHolder(text) {
      return 'Select ' + text;
    }
  
    onSearch(searchText) {
      this.searchOn = searchText.trim();
      this.getSchedules();
    }
  
    onSearchAll(searchText) {
      this.searchOn = searchText.trim();
     // this.onFilterChange(null);
    }
  
    transformResourceArray(resource) {
      if (!Array.isArray(resource)) {
        resource = [resource];
      }
      return resource;
    }
  
   convertDateToUTC(date) { 
      return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()); 
    }

    navigateTo(): void {
      if (!this.tempEvent) {
        return;
      }
      let rec = this.tempEvent.recurring;
      let d = new Date(this.tempEvent.start);
      d.setHours(0,0,0,0);
      let nextYear = 0;
  
      // navigate the calendar to the correct view
      if (rec && rec.repeat === 'yearly') {
        if (d.getMonth() + 1 > +rec.month && d.getDay() > +rec.day) {
          nextYear = 1;
        }
        this.calendarSelectedDate = new Date(d.getFullYear() + nextYear, rec.month - 1, rec.day);
      } else {
      this.calendarSelectedDate = d;
      }
    }
  
    changeView(): void {
      this.zoom = false;
          this.setWeekView();
    }
  
    zoomIn() {
      this.zoom = true;
      this.calView = {
        timeline: {
          type: 'week',
          timeCellStep: 120,
          timeLabelStep: 120,
        },
      };
    }
  
    setWeekView() {
      if (this.zoom) {
        this.zoomIn();
      } else {
        this.zoomOut();
      }
      this.navigateToCurrentDate();
    }
  
    updateWeekView() {
      if (this.zoom) {
        this.zoomOut();
      } else {
        this.zoomIn();
      }
      this.navigateToCurrentDate();
    }
  
    zoomOut() {
      // setTimeout(() => {
      this.zoom = false;
      this.calView = {
        timeline: {
          type: 'week',
          // startDay: this.weekStartDay,
          // endDay: this.weekEndDay,
          timeCellStep: 720,
          timeLabelStep: 720,
        },
      };
      // });
    }
  
    getSchedules() {
      this.loading = true;
      const dateUrl =
        '?start_date=' + new Date(this.calendarStartDate).toISOString() + '&end_date=' + new Date(this.calendarEndDate).toISOString();
      this.service
        .getSchedules(this.searchOn, dateUrl, true)
        .then((response) => {
          this.myResources = response.users;
          this.myEvents = response.schedules.map(x=> {
            x.color = x.color + jobOpacity;
            return x;
          })
          this.allEvents = this.myEvents.slice();
         // this.filter();
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.loading = false;
        });
    }
    
    onPageLoading(event) {
      this.calendarStartDate = event.firstDay;
      this.calendarEndDate = event.lastDay;
      this.navigateToCurrentDate(event);
      this.getSchedules();
      const dateFormat = 'DD/MM/YYYY';
      this.selectedDate= [this.calendarStartDate, this.calendarEndDate]
      this.dateInput = formatDate(dateFormat, new Date(this.calendarStartDate)) + ' - ' + formatDate(dateFormat, new Date(+event.lastDay - 1));
     // this.dateInput = new Date(this.calendarStartDate).toISOString() + ' - ' + new Date(this.calendarEndDate).toISOString();
    }
  
    ngOnInit(): void {
      this.opacity = avatarOpacity;
      this.storeApp=true;
      this.pausedEvent = null;
      this.pausedRecurringEvent = null;
      this.pageLoading = true;
      
      this.weekStartDay = this.gs.getWeekStartDay();
      this.calendarOptions.firstDay = this.weekStartDay;
      this.displayAllJobs = true;
      this.weeksArray = [];
      this.minDate = this.gs.getPrevDate(new Date(), 365);
      this.maxDate = this.gs.getNextDate(new Date(), 365);
      this.allEvents = [];
      this.myEvents = [];
      this.jobSearchText = '';
      this.initSelection();
     // this.getJobs();
      this.view = 'week';
  
      this.showFilterResponsive = false;
      this.showJobsFilter = false;
  
      this.gs.hideSplashScreen();
      this.changeView();
      this.pageLoading = false;
    }
  
    ngAfterViewChecked() {
      this.cdRef.detectChanges();
    }
  
    //Selection code starts here
    initSelection() {
      const initialSelection = [];
      const allowMultiSelect = true;
      this.selection = new SelectionModel<any>(allowMultiSelect, initialSelection);
    }

    navigateToCurrentDate(event= null) {
        const date = new Date();
        if (this.view == 'week') {
         if (date >= new Date(this.calendarStartDate) && date <= new Date(this.calendarEndDate)) {
            this.calendarSelectedDate = date;
         } else if (event) {
            this.calendarSelectedDate = new Date(+event.firstDay + 1);//Add 1 ms to scroll to start of first week
         }
        }
    }
  }
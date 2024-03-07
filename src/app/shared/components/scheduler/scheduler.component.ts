import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ChangeDetectorRef, AfterViewChecked,OnDestroy, HostListener, AfterViewInit } from '@angular/core';
import { momentTimezone, Notifications, MbscFormsModule, MbscDatepicker, MbscEventcalendar, print, updateRecurringEvent } from '@mobiscroll/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { oneDayInMs } from 'src/constants';


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
  clickToCreate: 'single',
  dragToCreate: false,
  dragToMove: true,
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

const daysDoesnotRepeat = [
  {
    id: 0,
    name: 'Sun',
    value: 'SU',
    checked: false,
    disabled: false,
    buffer: 0,
  },
  {
    id: 1,
    name: 'Mon',
    value: 'MO',
    checked: false,
    disabled: false,
    buffer: 0,
  },
  {
    id: 2,
    name: 'Tue',
    value: 'TU',
    checked: false,
    disabled: false,
    buffer: 0,
  },
  {
    id: 3,
    name: 'Wed',
    value: 'WE',
    checked: false,
    disabled: false,
    buffer: 0,
  },
  {
    id: 4,
    name: 'Thu',
    value: 'TH',
    checked: false,
    disabled: false,
    buffer: 0,
  },
  {
    id: 5,
    name: 'Fri',
    value: 'FR',
    checked: false,
    disabled: false,
    buffer: false,
  },
  {
    id: 6,
    name: 'Sat',
    value: 'SA',
    checked: false,
    disabled: false,
    buffer: 0,
  },
];

import { GeneralService } from 'src/app/core/services/general.service';
import { SchedulerService } from 'src/app/modules/scheduler/scheduler.service';
import { Router } from '@angular/router';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { NbDialogService } from '@nebular/theme';
import {FirestoreService} from 'src/app/core/services/firestore.service';
import { avatarOpacity, jobOpacity } from 'src/constants';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('500ms', style({ transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class SchedulerComponent implements OnInit, AfterViewChecked,OnDestroy {
  @ViewChild('picker', { static: false })
  pickerInst: MbscDatepicker;
  @ViewChild('untilPicker', { static: false })
  untilPickerInst: MbscDatepicker;
  // Template driven form
  @ViewChild('templateForm')
  templateForm: any;
  @ViewChild('leaveForm')
  leaveForm: any;
  @ViewChild('eventCalendar', { static: false })
  calendarInst: MbscEventcalendar;
  // @ViewChild('tooltip', { static: false })
  // tooltip!: MbscPopup;
  calendarModules = [print];
  templateSubmitted = false;
  leaveTemplateSubmitted = false;
  nameConfig: any;
  minutes: any;
  totalHoursInWeek: number = 0;
  remainingMinutes: number = 0;
  sortFilters: any = { name: 0, minutes: 0, scheduleTime: 0};
  filters: { role: any, tag: any};
  isFiltered: {role: boolean, tag: boolean};
  errorMessages = {
    startEndDate: {
      0: {
        required: 'This is required.',
        sameDates: 'Start date and end date cannot be same.',
        recurring: 'Recurring schedules cannot exceed 24 hours.'
      }, 
      1: {
        required: 'This is required.'
      }
    },
    user: {
      required: 'This is required.',
    },
    userTwo: {
      required: 'This is required.',
    },
    startTime: {
      required: 'This is required.',
      recurring: 'Recurring schedules cannot exceed 24 hours.'
    },
    endTime: {
      required: 'This is required.',
      sameDates: 'Start date and end date cannot be same.',
      // recurring: 'Recurring schedules cannot exceed 24 hours.'
    },
    repeat: {
      required: 'This is required.',
      pattern: 'Only positive numbers allowed.',
      maxlength: 'Only 3 digits allowed.',
    },
    dateUntil: {
      required: 'This is required.',
    },
    selectedWeeks: {
      pattern: 'Please select at least one day',
      required: 'Please select at least one day',
    },
    leaveType: {
      required: 'This is required.',
    },
    leaveStart: {
      required: 'This is required.',
    },
    leaveEnd: {
      required: 'This is required.',
    },
  };
  isNewEvent: boolean;
  participants: any;
  anchor: any;
  allEvents: MbscCalendarEvent[];
  showFilterResponsive: boolean;
  filterOn: any;
  showHelperButton: boolean;
  searchContext: boolean;
  public momentPlugin = momentTimezone;
  zoom: boolean;
  searchOn: any;
  loading: boolean = false;
  loadingLeaves: boolean = false;
  selectAll: boolean;
  popEventLoading: boolean = false;
  selectedScheduleId: any;
  selectedScheduleStatus: boolean;
  selectedLeaveId: any;
  calendarStartDate: string;
  calendarEndDate: string;
  maxDate: Date;
  minDate: Date;
  cancelRecurrenceUpdate: boolean;
  weeksArray: any;
  minUntilDate: any;
  weekStartDay: number = 0;
  isSchedulerNotification;
  weekEndDay: number = 6;
  pageLoading: boolean;
  participantData: any[];
  different: { less: boolean };
  pausedEvent: any = null
  pausedRecurringEvent: any;
  opacity: number;
  startDateOfSch: any;
  endDateOfSch: any;
  allInvalids: MbscCalendarEvent[];
  leavesOfSelectedResource: any;
  leaveStartDate: any;
  leaveEndDate: any;
  tempLeave: any;
  selectedLeaveOption: any;
  sharedRegion:number;
  deleteText: any;
  emptyResults: boolean;
  emptySearchResults: boolean;
  subscription:any;
  subscriptioSingle:any;
  enablePublish: boolean;
  printView: boolean = false;
  scheduleOpacity: string;
  hidePrint: boolean = false;
  isTimelineView: boolean = false;
  showOnlyPublishedSchs: boolean = true;
  singleOrDouble: any = false;
  displayPopup: boolean = false;
  onlyScheduled: boolean = true;
  gettingSchs: boolean = false;
  roleConfig: any;
  isSchedulingEnabled: boolean = true;
  minimumSchMinutes: number = 15;
  showSideBar: boolean = false;
  showSideBarHistory: boolean = false;
  isTimeOff: boolean;
  isTimeOffNoti: any;
  isOpenSwapNoti: any;
  displayPopupCopy: boolean;
  selectedDateWeekly: { start: Date; end: Date; };
  filtersCopy: any;
  copyText: string;
  roles: any;
  form: FormGroup;
  defaultOpen: boolean = true;
  defaultOpen2: boolean = true;
  myResourcesCopy: any;
  myResourcesForPrint: any;
  tags: any;
  storeLevelSettings: boolean;
  companyWeekStartDay: any;
  copiedObject: any;
  recurringEditMode: any;
  recurringEditModes: any = [
    { value: 'current', text: 'Update this schedule only', info: 'Only this schedule will be', deleteHelpingText: ''  },
    { value: 'following', text: 'Update this and following schedules', info: 'Only this and following schedules will be', deleteHelpingText: 'some occurrences of' },
    { value: 'all', text: 'Update all schedules', info: 'All schedules in the series will be', deleteHelpingText: 'all occurences of' }
  ];
  originalRecurringEvent: any;
  eventOccurrence: MbscCalendarEvent = {};
  newEvent: MbscCalendarEvent = {};
  eventInEditMode: any;
  eventForForm: any;
  isEditingRecurringSchedule: boolean;
  subOccurrences: any;

  animate: boolean = false;
  oldEvent: any;
  isHistory: boolean;
  constructor(
    private fb: FormBuilder,
    private dialogService: NbDialogService,
    private dataService: DataSharedService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private notify: Notifications,
    private schedulerService: SchedulerService,
    private gs: GeneralService,
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private analytics: FirestoreService
  ) {
    this.weekDays = JSON.parse(JSON.stringify(days));
    this.dataService.getRoles(false).then((roles) => {
			this.roles = roles;
		}).finally(() => {});	
    this.dataService.getCompanyUserTags(false).then((tags) => {
			this.tags = tags;
		}).finally(() => {});	
  }
  myEvents: MbscCalendarEvent[] = [];
  view: any;
  scheduleType: any;
  calView: MbscEventcalendarView;

  @ViewChild('popup', { static: false })
  popup!: MbscPopup;
  popupEventDescription = '';
  // popupEventAllDay = false;
  popupEventDates: any;
  calendarSelectedDate: any = new Date();
  todaysDate: any = new Date().setHours(0,0,0,0)

  shiftDate: any;
  tempShift!: MbscCalendarEvent;
  switchLabel: any = 'All-day';
  myResources = [];
  myInvalids = [];
  repeatDataLeaves: any = [];
  repeatData = [
    {
      value: 'norepeat',
      text: 'Does not repeat',
    },
    {
      value: 'daily_c',
      text: 'Repeats Daily'
    }, {
      value: 'weekly_c',
      text: 'Repeats Weekly'
    }, {
      value: 'monthly_c',
      text: 'Repeats Monthly'
    },
  ];
  usersList = [];

  // repeatDataJobs = [
  // ];
  weekDays: any;
  weekDaysCheckBoxes: any;
  selectedDay: any;
  selectedRepeat = '1';
  selectedOption = '1';
  selectResponsive = {
    xsmall: {
      touchUi: true,
    },
    small: {
      touchUi: false,
    },
  };
  showCustomRepeat = false;
  repeatType = 'daily';
  repeatNr = 1;
  monthlyDays = ['1'];
  monthlyDay = '1';
  yearlyDays = ['1'];
  yearlyDay = 1;
  colors = [
    {
      value: '#88D5FF'
    },
    {
      value: '#96F592',
    },
    {
      value: '#cddc39',
    },
    {
      value: '#FEABE4',
    },
    {
      value: '#F9F391',
    },
    {
      value: '#d89aff',
    },
    {
      value: '#ffac8e',
    },
    {
      value: '#aac7eb',
    },
    {
      value: '#ffcf87',
    },
    {
      value: '#64E3C9',
    },
  ];
  views = [
    { value: 'week', name: 'Week' }, { value: 'timelineMonth', name: 'Month' }
  ]
  months = [
    {
      value: 1,
      text: 'January',
    },
    {
      value: 2,
      text: 'February',
    },
    {
      value: 3,
      text: 'March',
    },
    {
      value: 4,
      text: 'April',
    },
    {
      value: 5,
      text: 'May',
    },
    {
      value: 6,
      text: 'June',
    },
    {
      value: 7,
      text: 'July',
    },
    {
      value: 8,
      text: 'August',
    },
    {
      value: 9,
      text: 'September',
    },
    {
      value: 10,
      text: 'October',
    },
    {
      value: 11,
      text: 'November',
    },
    {
      value: 12,
      text: 'December',
    },
  ];

  selectedMonth = 1;
  selectedColorWhileAdding = this.colors[0].value;
  selectedColorWhileEditing = this.colors[0].value;
  // selectedColor = this.colors[0].value;
  untilDate: any;
  occurrences = 1;
  condition = 'until';
  tempEvent: any;
  minStartTime: any;
  maxStartTime: any;
  minEndTime: any;
  maxEndTime: any;
  rangeText = '';
  tooltipTime = '';
  previousEndTime: any;
  optionsLeave: MbscDatepickerOptions = {
    controls: ['calendar'],
    display: 'anchored',
    showRangeLabels: false,
    touchUi: false,
    onChange: (args: any, inst: any) => {
      if (inst.name == 'leaveStart') {
        this.leaveStartDate?.setHours(0, 0, 0, 0);
      } else {
        this.leaveEndDate?.setHours(0, 0, 0, 0);
      }
    },
  }


  options: MbscDatepickerOptions = {
    controls: ['date', 'timegrid'],
    display: 'anchored',
    showRangeLabels: false,
    touchUi: false,
    stepMinute: this.minimumSchMinutes,
    closeOnOverlayClick: true,
    itemHeight: 25,
    rows: 5,
    dateWheels: '|DDD MMM D|',
    onChange: (args: any, inst: any) => {
        const date = args.value;
        date == null ? this.startDateOfSch = this.minStartTime : '';
        date == null ? this.endDateOfSch = this.minEndTime : '';
        if (inst.name == 'startTime') {
          this.startDateOfSch.getDate() > this.maxStartTime.getDate() ?
            this.startDateOfSch.setFullYear(this.maxStartTime?.getFullYear(), this.maxStartTime?.getMonth(), this.maxStartTime?.getDate()) : ''
            this.startDateOfSch = this.roundTimeQuarterHour(date)
            this.resetEndTime()
            inst.close()
        } else {
          this.endDateOfSch.getTime() > this.maxEndTime.getTime() ?
          this.endDateOfSch.setFullYear(this.maxEndTime?.getFullYear(), this.maxEndTime?.getMonth(), this.maxEndTime?.getDate()) : ''
          this.endDateOfSch = this.roundTimeQuarterHour(date)

          let currentTime = new Date()
          if (currentTime.getHours() == date.getHours() && (currentTime.getMinutes() == date.getMinutes())) {
            this.endDateOfSch.setHours(new Date(this.previousEndTime as any).getHours(), new Date(this.previousEndTime as any).getMinutes())
            this.closePicker(this.previousEndTime, this.endDateOfSch, inst)
          } else {
            this.closePicker(this.previousEndTime, this.endDateOfSch,inst)
            this.previousEndTime = this.endDateOfSch
          }
        }
        // inst.close()
    },
    onOpen: (args: any) => {
      this.startDateOfSch == null ? this.startDateOfSch = this.minStartTime : '';
      this.endDateOfSch == null ? this.endDateOfSch = this.minEndTime : '';
    },
};

closeDetails() {
  this.showSideBar = false;
  this.showSideBarHistory = false;
  // this.selectedRowData = null; 
  this.gs.showBackDrop(false);  
}

closePicker(prev, end, inst) {  
  if (new Date(prev as any).getDate() === new Date(end as any).getDate()) {
    inst.close()
  }
}

roundTimeQuarterHour(time) {
  var timeToReturn = new Date(time);
  timeToReturn.setMinutes(Math.round(timeToReturn.getMinutes() / this.minimumSchMinutes) * this.minimumSchMinutes, 0);
  return timeToReturn;
}

resetEndTime(){
  if (this.startDateOfSch !== null) {
  this.minEndTime = new Date(this.startDateOfSch)
  this.minEndTime.setMinutes(this.startDateOfSch?.getMinutes() + this.minimumSchMinutes);
  // this.maxEndTime?.setDate(this.startDateOfSch?.getDate()+1)
  // let oneDay = 60 * 60 * 24 * 1000;
  if (this.isLeaveOnNextDay()) {
    this.maxStartTime.setHours(23,30,0,0)
    this.maxEndTime = new Date(this.maxStartTime);
    this.maxEndTime.setMinutes(this.maxStartTime?.getMinutes() + this.minimumSchMinutes);
  } else {
  this.maxEndTime = new Date(this.startDateOfSch?.getTime() + oneDayInMs)
  this.maxEndTime.setHours(23,45,0,0)
  }
}
}
setMinandMaxDatesOfPicker(start, end){
  this.minStartTime = new Date(start)
  this.minStartTime.setHours(0,0,0,0)
  this.maxStartTime = new Date(start)

  this.minEndTime = new Date(this.startDateOfSch)
  this.minEndTime.setMinutes(this.startDateOfSch?.getMinutes() + this.minimumSchMinutes);
  this.isEdit ? this.maxEndTime = new Date(this.startDateOfSch) : this.maxEndTime = new Date(end)
  // this.maxEndTime?.setDate(this.maxEndTime?.getDate()+1)
  // let oneDay = 60 * 60 * 24 * 1000;
  if (this.isLeaveOnNextDay()) {
    this.maxStartTime.setHours(23,30,0,0)
    this.maxEndTime = new Date(this.maxStartTime);
    this.maxEndTime.setMinutes(this.maxStartTime?.getMinutes() + this.minimumSchMinutes);
  } else {
  this.maxStartTime.setHours(23,45,0,0)
  this.maxEndTime = new Date(this.startDateOfSch?.getTime() + oneDayInMs)
  this.maxEndTime.setHours(23,45,0,0)
  }
}

  isLeaveOnNextDay() {
    let thisWeekLeavesOfSelectedUser = this.myInvalids.filter(x=> x.resource == this.tempEvent.resource);
    return thisWeekLeavesOfSelectedUser.some((x) => new Date(x.start).getTime() == new Date(this.minStartTime?.getTime() + oneDayInMs).getTime());
  }

  calendarOptions: MbscEventcalendarOptions = {
    showEventTooltip: false,
    // height: 500,
    onPageChange: (event) => {
    },    
    onEventCreate: (args: any, inst: any) => {
      if (this.loading || this.popEventLoading || this.myResources.length == 0) {
        return false
      }
      this.pausedEvent = args.event;  //store the new event
      this.setControls(args);
      if (args.domEvent.target) {
        this.popupAnchor = args.domEvent.target;
      }
      if (this.hasOverlap(args, inst)) {
        this.notify.toast({
          message: 'Make sure not to double book',
        });
        return false;
      }
      const originEvent = args.originEvent;
      this.selectedScheduleId = originEvent?.id;
      if (originEvent && originEvent.recurring) {
        this.newEvent = args.event;
        return false;
      } else {
        return true;
      }
    },
    onEventCreated: (args: any, inst: any) => {
      if (this.loading || this.popEventLoading) {
        return false
      }
      if (args.action == 'drag' && args.event.job_id) {
        delete args.event['recurringException'];
        if (this.pausedEvent === null) {
          this.loading = true;
          this.addSchedule(args.event);
        }
        return;
      }
      setTimeout(() => {
        this.isEdit = false;
        this.tempEvent = args.event;
        this.eventForForm = args.event;
        this.tempLeave = args.event;
        const resource: any = this.myResources.find((r) => r.id === this.tempEvent.resource);
        if (this.copiedObject) {
          this.pasteCopiedEvent(this.tempEvent)
        } else {
        // fill popup form with event data
        this.loadPopupForm(args.event);
        // set popup options
        this.popupAnchor = args.target;
        this.popupHeaderText = '<div class="sch-username">' + resource?.name + '</div>';
        this.popupButtons = this.popupAddButtons;
        this.disableEnableAddUpdateOfPopupViaProperty();
        for (const d of this.weekDaysCheckBoxes) { d.checked = false; d.disabled = false; d.invalid = false; }
        this.setSelectedDay()
        this.resetCustomValues();
        // open the popup
        this.pausedEvent && this.pausedRecurringEvent ? '' : this.popup.open();
        this.scrollToBottom()
        }
      });
      if (this.hasOverlap(args, inst)) {
        return false;
      }
    },
    onEventUpdate: (args: any, inst: any) => {
      this.oldEvent = args.oldEvent;
      if (this.loading || this.popEventLoading) {
        return false
      }
      if (args && args.domEvent === undefined) {
         return false;
      }
      if (this.cancelRecurrenceUpdate) {
        this.cancelRecurrenceUpdate = false;
        return false;
      }
      let newResource = args.event.resource.filter((x) => !args.oldEvent.resource.includes(x));
      let result = this.myResources.filter((user) => user.id == newResource[0]);
      return true;
    },
    // clickToCreate: 'single',
    dragToCreate: false,
    // dragToMove: true,
    dragToResize: false,
	  firstDay: 0,
    view: {
      calendar: { type: 'month', labels: true },
    },
    timezonePlugin: momentTimezone,
    dataTimezone: 'utc',
    displayTimezone: 'local',
    
    onEventDelete: (args: any, inst: any) => {
     if (args && args.domEvent === undefined) {
       return false;
     }
    },
    onEventCreateFailed: (args: any, inst: any) => {
      this.analytics.logEvents("update_leave_modal");
      this.scheduleType = 'leave';
      this.popupAnchor = args.target;
      this.isEdit = true;
      this.tempLeave = args.invalid;
      this.selectedLeaveId = this.tempLeave.id;
      const resource: any = this.myResources.find((r) => r.id === this.tempLeave.resource);
      this.popupHeaderText = '<div class="sch-username">Edit ' + resource.name + '\'s leave</div><div class="employee-shifts-day">' +
      formatDate('DDD, MMM DD', new Date(args.event?.start)) + '</div>';
      this.popupButtons = this.popupLeaveEditButtons;
      this.disableEnableAddUpdateOfPopupViaProperty();
      this.deleteText = "You're about to <b>permanently delete</b> time off. Are you sure?"
      this.loadLeaveForm(this.tempLeave);
      setTimeout(() => {
        this.popup.open();
      },100); 
    },
    onEventDragStart: (args: any, inst: any) => {
      if (this.loading || this.popEventLoading) {
        return false;
      }
    },

    onEventDeleted: (args) => {
      setTimeout(() => {
        this.deleteEvent(args.event);
      });
    },
    onEventUpdated: ($event, inst) => {
      if (this.loading || this.popEventLoading) {
        return false
      }
      $event.event.resource = this.transformResourceArray($event.event.resource);
      if (this.pausedEvent !== null) {
        this.pausedRecurringEvent = $event;
        this.openConfirmationPopup();
        return;
      } else {
      }
      this.loading = true;
      if ($event.event.parentId === null) {
        delete $event.event.parentId;
      }
      this.updateSchedule($event.event);
      // here you can update the event in your storage as well, after drag & drop or resize
    },
    onEventHoverIn: (args, inst) => {
      // if (this.loading || this.popEventLoading) {
      //   return false
      // }
      const event: any = args.event;
      this.tooltipTimeText(event)
    },
    onEventHoverOut: () => {
    },
  };

  setInvalidDays() {
    let leaves = JSON.parse(JSON.stringify(this.myInvalids));
    leaves.forEach(leave => {
      leave.start = new Date(leave.start);
      leave.end = new Date(leave.end);
    });
    let myInvalidsUser = leaves.filter(x => {return x.resource == this.tempEvent.resource});
    myInvalidsUser.forEach(x=> {
      const date = new Date(x.start);
      while (date <= x.end
              && date.getTime() >= new Date(this.calendarStartDate).getTime()
              && date.getTime() <= (new Date(this.calendarEndDate).getTime() - oneDayInMs)) {
      this.weekDaysCheckBoxes.find(d => {
        if (d.id === new Date(date as any).getDay()) {
          d.invalid = true;
        }
      })
      date.setDate(date.getDate() + 1);
      }
    })
  }
  
  setSelectedDay() {
    this.isTimelineView ? '' : this.setInvalidDays();
    this.selectedDay = this.weekDaysCheckBoxes.find(d => d.id === new Date(this.tempEvent.start).getDay())
    this.selectedDay.checked = true;
    this.selectedDay.disabled = true;
    this.selectedDay.buffer = 0;
    this.resetBufferOfWeekDays()
  }

  resetBufferOfWeekDays() { //wrt selectedDay
    const indexOfSelectedDay = this.weekDaysCheckBoxes.findIndex(item => item.name === this.selectedDay.name);
    this.weekDaysCheckBoxes.forEach((day, i) => {
      day.buffer = i - indexOfSelectedDay;
    });
  }

  tooltipTimeText(event) {
      let repeatText = '';
      if (event.recurring) {
        repeatText = ' \u00A0Repeats ' + event.recurring.repeat;
      }
      this.tooltipTime = 
      ' \u00A0Status: ' + (event.isPublished ? 'Published\u00A0' : 'Unpublished') 
       + '\u00A0 \u00A0 \u00A0 \u00A0 \u00A0 \u00A0 \u00A0 \u00A0 \u00A0 \u00A0'
       + formatDate('hh:mm A', new Date(event.start)) +
       ' - '
        + formatDate('MMM DD, hh:mm A', new Date(event.end))
        + repeatText;
  }
  popupHeaderText!: string;
  popupAnchor: HTMLElement | undefined;
  popupAddButtons = [
    {
      handler: (args, inst) => {
        this.registerTempl();
      },
      keyCode: 'enter',
      text: 'Add Schedule',
      disabled: false,
      cssClass: 'mbsc-popup-button-primary btn-scheduler proceedBtn',
    },
    {
      handler: (args, inst) => {
        this.closePopup();
      },
      text: 'Cancel',
      cssClass: 'mbsc-popup-button-primary cancelbtn',
    },
  ];
  popupLeaveButtons = [
    {
      handler: (args, inst) => {
        this.registerTemplLeave();
      },
      keyCode: 'enter',
      text: 'Add Leave',
      disabled: false,
      cssClass: 'mbsc-popup-button-primary btn-scheduler',
    },
    {
      handler: (args, inst) => {
        this.closePopup();
      },
      text: 'Cancel',
      cssClass: 'mbsc-popup-button-primary cancelbtn',
    },
  ];
  popupLeaveEditButtons = [
    {
      handler: (args, inst) => {
        this.registerTemplLeave();
      },
      keyCode: 'enter',
      text: 'Update Leave',
      disabled: false,
      cssClass: 'mbsc-popup-button-primary btn-scheduler',
    },
    {
      handler: (args, inst) => {
        this.closePopup();
      },
      text: 'Cancel',
      cssClass: 'mbsc-popup-button-primary cancelbtn',
    },
  ];
  popupEditButtons = [
    {
      handler: ($event) => {
        this.registerTempl();
      },
      keyCode: 'enter',
      text: 'Update Schedule',
      disabled: false,
      cssClass: 'mbsc-popup-button-primary btn-scheduler proceedBtn',
    },
    {
      handler: (args, inst) => {
        this.closePopup();
      },
      text: 'Cancel',
      cssClass: 'mbsc-popup-button-primary cancelbtn',
    },
  ];
  popupButtons: any = [];
  popupOptions: MbscPopupOptions = {
    display: 'center',
    contentPadding: false,
    fullScreen: true,
    scrollLock: false,
    height: 500,
    onClose: () => {
      this.repeatData = this.repeatData.filter((item) => item.value !== 'custom-value');
      setTimeout(() => {
		this.untilDate = null;
        this.participants = null;
        this.usersList = [];
      }, 20);
      if (!this.isEdit) {
        // refresh the list, if add popup was canceled, to remove the temporary event
        this.allEvents = [...this.allEvents];
        this.filter();
      }
    },
    onPosition: (event, inst) => {
      return false;
    },
    responsive: {
      medium: {
        display: 'anchored',
        width: 550,
        fullScreen: false,
        touchUi: false,
      },
    },
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

  loadLeaveForm(event: MbscCalendarEvent): void {
    const startDate = event.original ? new Date(event.original.start as any) : new Date(event.start as any);
    const endDate = event.original ? new Date(event.original.end as any) : new Date(event.end as any);
    this.leaveStartDate = startDate;
    this.leaveEndDate = endDate;
    this.leaveStartDate.setHours(0, 0, 0, 0);
    this.leaveEndDate.setHours(0, 0, 0, 0);
    if (this.isEdit) {
      this.selectedLeaveOption = event.title; 
    }
  }
  loadPopupForm(event: MbscCalendarEvent): void {
    this.eventInEditMode = event;
    this.selectedColorWhileEditing = event.color !== undefined ? event.color : this.colors[0].value;
    this.isEdit || this.pausedEvent ? '' : event.color = this.selectedColorWhileAdding;
    event['allDay'] = false;
    this.recurringEditMode =  event.recurring ? this.recurringEditModes[1].value : this.recurringEditModes[0].value;
    this.templateSubmitted = false;
    this.leaveTemplateSubmitted = false;
    this.setStartAndEndDates();
    // moved the following code to function
    // const startDate = event.original ? new Date(event.original.start as any) : new Date(event.start as any);
    // const endDate = event.original ? new Date(event.original.end as any) : new Date(event.end as any);
    // this.startDateOfSch = startDate;
    // this.endDateOfSch = endDate;
    // this.previousEndTime = this.endDateOfSch
    // this.setMinandMaxDatesOfPicker(this.startDateOfSch, this.endDateOfSch)
    this.popupEventDescription = event.description;
    // this.resetUntilDate();
    // this.popupEventAllDay = false;
    // this.selectedColor = this.colors.find(c => c.value == event.color) ? event.color : this.colors[0].value;
    // this.updateCustomForm();
    setTimeout(() => {
    this.getLeaves(event.resource);
    }, 20);
  }

  setStartAndEndDates() {
    const startDate = this.recurringEditMode === 'all' && this.eventInEditMode.original ? new Date(this.eventInEditMode.original.start as any) : new Date(this.eventInEditMode.start as any);
    const endDate = this.recurringEditMode === 'all' && this.eventInEditMode.original ? new Date(this.eventInEditMode.original.end as any) : new Date(this.eventInEditMode.end as any);
    this.startDateOfSch = startDate;
    this.endDateOfSch = endDate;
    this.previousEndTime = this.endDateOfSch
    this.setMinandMaxDatesOfPicker(this.startDateOfSch, this.endDateOfSch)
    this.resetUntilDate();
    this.deleteText = this.isEditingRecurringSchedule && this.recurringEditMode !== 'current'
      ? "<span class='deleteInfo'><span class='colored-text'>" + this.getInfoText() + " deleted.</span><span class='mt-06'>You're about to <b>permanently delete </b>" + this.recurringEditModes.find(item => item.value === this.recurringEditMode)?.deleteHelpingText + " this schedule. Are you sure?</span></span>"
      : "You're about to <b>permanently delete</b> this schedule. Are you sure?"
    this.updateCustomForm();
  }

  setColor(color) {
    this.isEdit ? this.selectedColorWhileEditing = color : this.selectedColorWhileAdding = color;
  }

  toggleView() {
    this.gs.logEvents('sch_published_and_unpublished_toggled')
    this.showOnlyPublishedSchs = !this.showOnlyPublishedSchs;
    this.getSchedules()
  }

  setDateWeekly(date) {
    this.selectedDateWeekly = this.gs.getWeek(date.start, this.weekStartDay);
  }

  proceedCopy() {
    if (!this.sharedRegion) {
      return;
    }
    const data = {
      region_id: this.sharedRegion,
      copy_from_week: {start: new Date(this.calendarStartDate).toISOString(), end: new Date(this.calendarEndDate).toISOString()},
      copy_to_week:  {start: new Date(this.selectedDateWeekly.start).toISOString(), end: new Date(this.selectedDateWeekly.end).toISOString()}
    }
    this.schedulerService
      .copySchedules(data)
      .then((response: any) => {
        this.gs.showToastSuccess(response?.message);
        setTimeout(() => {
          this.displayPopupCopy = false;
          this.calendarSelectedDate = this.selectedDateWeekly.start; //navigate to selected week
          this.showOnlyPublishedSchs = false;
        }, 100);
      })
      .catch((error) => {
        this.gs.showToastError(error?.message);
      })
      .finally(() => {
      });
  }

  checkHoursCount(data = null) {
    // setTimeout(() => {
      // this.allEvents.forEach(event => {
      //   const elements = document.querySelectorAll('[data-id="' + event.id + '"]');
      //   Object.assign(event, { totalRepeat: elements.length })
      // });
      setTimeout(() => {
        this.checkTotalHours(null, data)
      }, 10);
    // }, 10);
  }

  checkTotalHours(date: any, data = null): any {
    let allEvs = this.calendarInst?.getEvents(new Date(this.calendarStartDate), new Date(this.calendarEndDate))
    let resources = JSON.parse(JSON.stringify(data ? data : this.myResourcesCopy));
    for (let res of resources ) { res.minutes = 0 }
    for (let event of allEvs) {
    if (new Date(String(event.start)).getTime() >= new Date(String(this.calendarStartDate)).getTime()) {
      // let noOfResources = 0;
      // noOfResources = Object.keys(event.resource).length;
      for (const resourceNr of event.resource as any) {
      let mins = 0, totalMins = 0;
      mins = (new Date(String(event.end)).getTime() - new Date(String(event.start)).getTime()) / (1000 * 60)
      // totalMins = mins * event.totalRepeat;
      // noOfResources > 1 ? totalMins = totalMins/noOfResources : '';      
      for (let res of resources ) {
        resourceNr == res.id ? res.minutes = res.minutes + mins : ''
      }
      }
    }
  }
  if (this.sortFilters['minutes'] !== 0) {
    this.onSortNum(this.sortFilters['minutes'] , 'minutes', resources);
  } else if (this.sortFilters['name'] !== 0) {
    this.onSort(this.sortFilters['name'], 'name', resources);
  } else if (this.sortFilters['scheduleTime'] !== 0) {
    this.sortResWrtScheduleTime(this.sortFilters['scheduleTime'], 'scheduleTime', resources);
  } else {
    this.myResources = [...resources];
    setTimeout(() => {
      this.emptySearchResults = this.myResources?.length == 0 ? true : false;
    });
  }
    this.totalScheduledMinutes(resources);
  }

  totalScheduledMinutes(data) {
    let totalMins = 0
    data.forEach(res => {
      totalMins += res.minutes;
    });
    this.totalHoursInWeek = totalMins/60;
    // setTimeout(() => {
    //   this.myResourcesCopy = JSON.parse(JSON.stringify(this.myResources));
    // });
  }

  resetUntilDate() {
    if (this.startDateOfSch) {
    const date = new Date(this.startDateOfSch);
    const prevUntilDate = new Date(this.untilDate);
    date.setHours(0,0,0,0);
    prevUntilDate.setHours(0,0,0,0);
    if (!this.untilDate || prevUntilDate <= date) {
      const dateplus30 = this.gs.getNextDate(date, 30)
      this.untilDate = formatDate('YYYY-MM-DD', dateplus30);
      // this.untilDate = formatDate('YYYY-MM-DD', date);
      this.minUntilDate = this.gs.getNextDate(date);
    }
  }
  }

  @HostListener('document:click')
    public onClick(targetElement) {
      if (this.displayPopup) {
        this.displayPopup = false;
      }
    }

  openConfirmationPopup() {
    this.dialogService.open(ConfirmModalComponent,{hasBackdrop: true, closeOnBackdropClick: false, context: {heading: 'Are you sure?', subHeading: 'If yes, this schedule will be removed from the repeat pattern.'}
    }).onClose.subscribe(isActionConfirmed => {
      if (this.pausedEvent && this.pausedRecurringEvent) {
        if (isActionConfirmed) { //proceed
            let event: any;
            this.loading = true;
            if (!this.tempEvent.is_unpublished_schedule) {
            [this.pausedRecurringEvent.event, this.pausedEvent].forEach(obj => {
              Object.assign(obj, { parentId: this.tempEvent?.parentId ? this.tempEvent?.parentId : this.selectedScheduleId })
            });
            }
            event = { ...event,
              updatedSchedule: this.pausedRecurringEvent.event,
              newSchedule: this.pausedEvent
            };
            this.splitSchedule(event);
            // this.addSchedule(this.pausedEvent);
            // this.updateSchedule(this.pausedRecurringEvent.event)
        } else { //revert
          this.getSchedules();
          this.pausedEvent = null;
          this.pausedRecurringEvent = null;
        }
    }
    });
  }

  getPlaceHolder(text) {
    return 'Select ' + text;
  }

  onSearch(searchText) {
    this.gs.logEvents('search_scheduler')
    this.searchOn = searchText.trim();
    this.getSchedules();
  }

  onSearchAll(searchText) {
    this.gs.logEvents('search_scheduler')
    this.searchOn = searchText.trim();
   // this.onFilterChange(null);
  }

  transformResourceArray(resource) {
    if (!Array.isArray(resource)) {
      resource = [resource];
    }
    return resource;
  }

  compareDates(d) {
	d.setSeconds(0,0);
    let monthLocal = d.getMonth() + 1;
    let monthStrLocal = monthLocal < 10 ? '0' + monthLocal : monthLocal;
    const localDate = Date.parse('' + d.getFullYear() + '-' + monthStrLocal + '-' + d.getDate());
    let month = d.getUTCMonth() + 1;
    let monthStr = month < 10 ? '0' + month : month;
    const utcDate = Date.parse('' + d.getUTCFullYear() + '-' + monthStr + '-' + d.getUTCDate());

    if (utcDate < localDate) {
      this.different = { less: true };
    } else if (utcDate > localDate) {
      this.different = { less: false }; //utc is greater than local date
    } else {
      this.different = null;
    }
  }

  resetEndDate($event) {
    if (this.startDateOfSch && this.endDateOfSch == null) {
      this.endDateOfSch = this.startDateOfSch
    }
  }

 convertDateToUTC(date) { 
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()); 
}

  setReccurranceRule(startDate) {
    let recurringRule: any;

    const d = new Date(startDate);
    this.compareDates(d);
    switch (this.selectedRepeat) {
      case 'daily':
        recurringRule = { repeat: 'daily' };
        break;
      case 'weekly':
        recurringRule = {
          repeat: 'weekly',
          weekDays: this.weekDays[d.getDay()].value,
        };
        break;
      case 'monthly':
        recurringRule = { repeat: 'monthly', day: d.getDate() };
        break;
      case 'yearly':
        recurringRule = { repeat: 'yearly', month: d.getMonth() + 1 };
        break;
      case 'weekday':
        recurringRule = { repeat: 'weekly', weekDays: 'MO,TU,WE,TH,FR' };
        break;
      case 'custom':
      case 'custom-value':
        recurringRule = {
          repeat: this.repeatType,
          interval: this.repeatNr,
        };

        switch (this.repeatType) {
          case 'weekly':
            if (!this.different) {
              recurringRule.weekDays = this.weekDays
                .filter((i) => i.checked)
                .map((i) => i.value)
                .join(',');
            } else {
              if (this.different.less) {
                const res = [];
                this.weekDays.forEach((x, index) => {
                  if (x.checked) {
                    if (index === 0) {
                      res.push(this.weekDays[this.weekDays.length - 1].value);
                    } else {
                      res.push(this.weekDays[index - 1].value);
                    }
                  }
                });
                recurringRule.weekDays = res.join(',');
              } else {
                const res = [];
                this.weekDays.forEach((x, index) => {
                  if (x.checked) {
                    if (index === 6) {
                      res.push(this.weekDays[0].value);
                    } else {
                      res.push(this.weekDays[index + 1].value);
                    }
                  }
                });
                recurringRule.weekDays = res.join(',');
              }
            }
            break;
          case 'monthly':
            if (!this.different) {
              recurringRule.day = this.monthlyDay;
            } else {
              if (this.different.less) {
                if (this.monthlyDay == '1') {
                  recurringRule.day = '-1'; //set to last day of the month
                } else {
                  recurringRule.day = '' + (parseInt(this.monthlyDay) - 1);
                }
              } else {
                if (this.monthlyDay == '31') {
                  recurringRule.day = '1';
                } else {
                  recurringRule.day = '' + (parseInt(this.monthlyDay) + 1);
                }
              }
            }
            break;
          case 'yearly':
            recurringRule.day = this.yearlyDay;
            recurringRule.month = this.selectedMonth;
            break;
        }

        switch (this.condition) {
          case 'until':
            if (!this.different) {
              recurringRule.until = formatDate('YYYY-MM-DD', new Date(this.untilDate));
            } else {
              let date = this.convertDateToUTC(new Date(this.untilDate));
              if (this.different.less) {
                recurringRule.until = formatDate('YYYY-MM-DD', new Date(date));
              } else {
                const res = this.gs.getNextDate(date);
                recurringRule.until = formatDate('YYYY-MM-DD', new Date(res));
              }
            }
            break;
          case 'count':
            recurringRule.count = this.occurrences;
            break;
        }
        break;
    }
    return recurringRule;
  }

  async saveEvent(): Promise<void> {
    const { _days, ...rest } = this.tempEvent;
    this.tempEvent = rest;
    if (!Array.isArray(this.participants)) {
      this.participantData = [this.participants];
    } else {
      this.participantData = this.participants.filter((id) => {
        if (this.usersList.find((i) => i.id == id || i.user_id == id)) {
          return id;
        }
      });
    }

    // this.tempEvent.start = this.startDateOfSch;
    // this.tempEvent.end = this.endDateOfSch;

    let start, end, recurringRule, parentId;
    if (this.isEdit) {
      start = this.startDateOfSch;
      end = this.endDateOfSch;
      parentId = this.tempEvent?.parentId;
      recurringRule = this.setReccurranceRule(start)
      this.saveTempEvent(start, end, recurringRule)
      this.tempEvent.id = this.selectedScheduleId;
      // update the event in the list
      this.popEventLoading = true;
      if (this.isEditingRecurringSchedule) { // recurring schedule
        if (this.recurringEditMode === 'current') {
          delete this.tempEvent.id;
          delete this.tempEvent.recurring;
          delete this.tempEvent.recurringException;
        }
        if (this.recurringEditMode === 'all') { // update all schedules
          this.updateSchedule(this.tempEvent);
        } else { // update current only or current and following schedules         
          let event = {};
          this.subOccurrences = this.breakRecurringEvent();
          let oldEvent = this.subOccurrences.updatedEvent;
          oldEvent.id = oldEvent.id ? oldEvent.id :  this.selectedScheduleId;
          this.resetUntilDateAfterSplitingSch(oldEvent);
          if (!this.tempEvent.is_unpublished_schedule) {
            Object.assign(this.subOccurrences.newEvent, { parentId: this.tempEvent?.parentId ? this.tempEvent?.parentId : oldEvent.id })
            Object.assign(oldEvent, { parentId: this.tempEvent?.parentId })
          }
          event = { ...event,
            updatedSchedule: oldEvent,
            newSchedule: this.subOccurrences.newEvent
          };
          this.splitSchedule(event);
          // this.updateSchedule(this.subOccurrences.updatedEvent); // update previous event
        }
      } else { // simple schedule
        this.updateSchedule(this.tempEvent);
      }
    } else {
      for (let i = 0; i < this.weekDaysCheckBoxes.length; i++) {
        this.tempEvent = {};
        const day = this.weekDaysCheckBoxes[i];
        if (day.checked) {
          start = new Date(this.startDateOfSch.getTime() + (oneDayInMs * day.buffer));
          end = new Date(this.endDateOfSch.getTime() + (oneDayInMs * day.buffer));
          recurringRule = this.setReccurranceRule(start)
          this.saveTempEvent(start, end, recurringRule)
          // add the new event to the list
          this.popEventLoading = true;
          await this.addSchedule(this.tempEvent);
        }
      }
      this.closePopup()
    }
  }

  resetUntilDateAfterSplitingSch(event) {
    const d = new Date(event.start);
    this.compareDates(d);            
    let untillDate = event.recurring.until
    if (this.different) {
      let date = this.convertDateToUTC(new Date(untillDate));
      if (!this.different.less) {
        const res = this.gs.getNextDate(date);
        event.recurring.until = formatDate('YYYY-MM-DD', new Date(res));
      }
    }
  }

  
  splitSchedule(event) {
    this.disableEnableAddUpdateOfPopupViaClass();
    this.popEventLoading = true;
    // let skipScheduleId = event?.updatedSchedule?.parentId || event.newSchedule?.parentId;
    this.schedulerService
      .splitSchedule(event, this.sharedRegion)
      .then((response: any) => {
        // TODO: live render - calling getSch() for now
        this.getSchedules();
        this.gs.showToastSuccess(response?.message);
        this.popup.close();
        this.enablePublish = true;
      })
      .catch((error) => {
        error.isOverlapping ?  this.gs.showToastWarning(error?.message, 'Overlapping Detected', 4) : this.gs.showToastError(error?.message);
        const indexToUpdate = this.myEvents.findIndex(ev => ev.id === event.updatedSchedule.id);
        if (this.oldEvent) {
          indexToUpdate !== -1 ? this.myEvents[indexToUpdate] = this.oldEvent : '';
        }
        this.myEvents = this.myEvents.filter(obj => obj.id !== null);
      })
      .finally(() => {
        this.pausedEvent = null;
        this.oldEvent = null;
        this.pausedRecurringEvent = null;
        this.popEventLoading = false;
        this.gettingSchs ? this.loading = true : this.loading = false;
        this.disableEnableAddUpdateOfPopupViaClass();
      });
  }


  breakRecurringEvent() {
    const events = updateRecurringEvent(
      this.originalRecurringEvent,
      this.eventOccurrence,
      this.isEdit ? null : this.newEvent,
      this.isEdit ? this.tempEvent : null,
      this.recurringEditMode
    );
    return events;
  }

  saveTempEvent(start, end, recurringRule) {
    this.tempEvent.title = null;
    this.tempEvent.description = this.popupEventDescription;
    this.tempEvent.start = start;
    this.tempEvent.end = end;
    this.tempEvent.allDay = false;
    this.tempEvent.recurring = recurringRule;
    this.tempEvent.color = this.isEdit ? this.selectedColorWhileEditing : this.selectedColorWhileAdding;
    // this.tempEvent.color = this.selectedColor;
    this.tempEvent.resource = this.participantData;
    this.tempEvent.isPublished = false; //used to keep record of pubished and unpublished schedules without calling getSchedules after every update - no impact on BE
    let tempArgs = { event: this.tempEvent };
    let exceptionOfRes = [];

    if (this.tempEvent.recurring) {
    this.leavesOfSelectedResource.forEach(leave => {
      let start = new Date(leave.start) as any
      let end = new Date(leave.end) as any
      if (start <= new Date(this.untilDate)) { // don't add those leaves in exception that are not within the untilDate
      let date = new Date(start.getTime());
      while (date >= start && date <= end) {
        const exception = new Date(date.getTime());
        exception.setHours(new Date(this.tempEvent.start as any).getHours(), new Date(this.tempEvent.start as any).getMinutes())
        if(exceptionOfRes.length !== 0) {
          exceptionOfRes.some(ex => new Date(ex).getTime() === new Date(exception).getTime()) ? '' : exceptionOfRes.push(new Date(exception));
        } else {
        exceptionOfRes.push(new Date(exception));
        }
        date = new Date(date?.getTime() + oneDayInMs);
        // date.setDate(date.getDate() + 1); //i think it will create an issue on last day of month
      }
      }
      //in case of graveyard recurring sch - add exception on previous day of leave too
      // commented bcz not implementng in leaves v1.0
      // if (this.tempEvent.start.getDate() !== this.tempEvent.end.getDate()) {
      //   const exception = new Date(start.getTime() - oneDayInMs);
      //   exception.setHours(new Date(this.tempEvent.start as any).getHours(), new Date(this.tempEvent.start as any).getMinutes());
      //   exceptionOfRes.push(new Date(exception));
      // }
    });
      this.tempEvent.recurringException = this.tempEvent.recurringException ? [ ...this.tempEvent.recurringException, ...exceptionOfRes ] : exceptionOfRes;
    }

    if (this.hasOverlap(tempArgs, null)) {
      return;
    }
  }

  filterLeaves(start) { // test
    let leaves = this.calendarInst.getInvalids(start);
    return leaves;
  }
  setCheckedDays(isChecked, i) {
    isChecked ? this.weekDaysCheckBoxes[i].checked = true : this.weekDaysCheckBoxes[i].checked = false;
  }

  deleteEvent(event: MbscCalendarEvent): void {
    this.allEvents = this.allEvents.filter((item) => item.id !== event.id);
    this.filter();
  }

  deleteLeaveEvent(event: MbscCalendarEvent): void {
    this.allInvalids = this.allInvalids.filter((item) => item.id !== event.id);
    this.filterInvalids();
  }

  onDeleteClick(): void {
    if (this.popEventLoading) {
      return;
    }
    if (this.scheduleType == 'leave') {
      this.deleteLeave()
    } else {
      if (this.isEditingRecurringSchedule) {
        this.subOccurrences = null;
        switch (this.recurringEditMode) {
          case 'current':
            let currentExceptions = this.tempEvent.recurringException || [];
            currentExceptions = [...currentExceptions, this.startDateOfSch];
            this.originalRecurringEvent.recurringException = currentExceptions;
            this.tempEvent.id = this.tempEvent.id ? this.tempEvent.id :  this.selectedScheduleId;
            Object.assign(this.tempEvent, { parentId: this.tempEvent?.parentId ? this.tempEvent?.parentId : this.selectedScheduleId })
            this.updateSchedule(this.tempEvent)              
            break;
          case 'following':
            let followingExceptions = this.tempEvent.recurringException || [];
            followingExceptions = [...followingExceptions, this.startDateOfSch];
            this.originalRecurringEvent.recurringException = followingExceptions;
            this.originalRecurringEvent.recurring.until = this.startDateOfSch;
            Object.assign(this.tempEvent, { parentId: this.tempEvent?.parentId ? this.tempEvent?.parentId : this.selectedScheduleId })
            this.updateSchedule(this.tempEvent);
            break;
          case 'all':
            this.deleteSchedule();
            break;
        }
      } else {
        this.deleteSchedule();
      }
    }
  }

  // set custom values to default
  resetCustomValues(): void {
    this.repeatType = 'daily';
    this.repeatNr = 1;
    this.condition = 'never';
    this.occurrences = 1;
    this.selectedMonth = 1;
    this.monthlyDay = '1';
    this.yearlyDay = 1;
    const newWeekDays = [...days];
    this.selectedRepeat = 'norepeat';
    this.selectedOption = 'norepeat';
    this.showCustomRepeat = false;
    this.repeatData = this.repeatData.filter((item) => item.value !== 'custom-value');
  }

  repeatsAnalytics() {
    this.analytics.logEvents("repeats_dropdown_scheduler");
  }
  setCondition(event) {
    this.popup.position()
    if (event !== 'norepeat' ){
      this.weekDaysCheckBoxes?.forEach(d => { d?.id === this.selectedDay?.id ? d.checked = true : d.checked = false });
      event = event?.slice(0, -2)
      this.repeatType = event;
      this.selectedRepeat = 'custom'
      this.scrollToBottom();
    } else {
      this.selectedRepeat = event
      this.repeatType = null;
    }
    if (this.selectedRepeat === 'custom') {
      this.condition = 'until';
    }
  }

  updateCustomForm(): void {
    const d = new Date(this.eventForForm.start);
    this.weekDays = JSON.parse(JSON.stringify(days));
    this.weeksArray = [];
    const weekday = d.getDay();
    const monthday = d.getDate();
    const newData = [...this.repeatData];

    // update select texts by selected date
    for (const item of newData) {
      switch (item.value) {
        case 'weekly':
          item.text = 'Weekly on ' + days[weekday].name;
          break;
        case 'monthly':
          item.text = 'Monthly on day ' + monthday;
          break;
        case 'yearly':
          item.text = 'Annually on ' + this.months[d.getMonth()].text + ' ' + monthday;
          break;
        default:
      }
    }

    this.repeatData = newData;
    const rec = this.eventForForm.recurring;

    if (rec) {
      this.compareDates(d);
      this.repeatType = rec.repeat;
      if (rec.interval) {
        // set custom text
        this.selectedRepeat = '';
        this.selectedOption = '';
        let customText = '';
        this.repeatNr = rec.interval;
        switch (rec.repeat) {
          case 'daily':
            customText = this.repeatNr > 1 ? 'Every ' + this.repeatNr + ' days' : 'Repeats Daily';
            break;
          case 'weekly':
            // this.weeksArray = [];
            let newWeekDays = JSON.parse(JSON.stringify(days));
            let weekD = rec.weekDays.split(',');
            if (this.different == null) {
			for (let i = 0; i < newWeekDays.length; i++) {
				if (weekD.includes(newWeekDays[i].value)) {
				  this.setCheckedItems(true, i);
				  newWeekDays[i].checked = true;
				}
			  }
            } else {
              if (this.different.less) {
                for (let i = 0; i < newWeekDays.length; i++) {
                  if (weekD.includes(newWeekDays[i].value)) {
                    this.setCheckedItems(true, i);
                    if (i < 6) {
                      newWeekDays[i + 1].checked = true;
                    } else if (i == 6) {
                      newWeekDays[0].checked = true; //first element
                    }
                  }
                }
              } else if (this.different.less === false) {
                for (let i = 0; i < newWeekDays.length; i++) {
                  if (weekD.includes(newWeekDays[i].value)) {
                    this.setCheckedItems(true, i);
                    if (i > 0) {
                      newWeekDays[i - 1].checked = true;
                    } else if (i == 0) {
                      newWeekDays[6].checked = true; //first element
                    }
                  }
                }
              }
            }

            this.weekDays = newWeekDays.map((x) => Object.assign({}, x));
            customText = this.repeatNr > 1 ? 'Every ' + this.repeatNr + ' weeks' : 'Repeats Weekly';
            customText +=
              ' on ' +
              this.weekDays
                .filter((i) => i.checked)
                .map((i) => i.name)
                .join(', ');
            break;
          case 'monthly':
            if (this.different == null) {
              this.monthlyDay = rec.day;
            } else {
              if (this.different.less) {
                if (rec.day == '-1') {
                  this.monthlyDay = '1';
                } else {
                  this.monthlyDay = '' + (parseInt(rec.day) + 1); //to do: cater different end of month usecases
                }
              } else {
                if (rec.day == '1') {
                  this.monthlyDay = '-1'; //to do: cater different end of month usecases
                } else {
                  this.monthlyDay = '' + (parseInt(rec.day) - 1);
                }
              }
            }
            customText = this.repeatNr > 1 ? 'Every ' + this.repeatNr + ' months' : 'Repeats Monthly';
            customText += ' on day ' + this.monthlyDay;
            break;
          case 'yearly':
            this.yearlyDay = rec.day;
            this.selectedMonth = rec.month;
            customText = this.repeatNr > 1 ? 'Every ' + this.repeatNr + ' years' : 'Repeats Annualy';
            customText += ' on ' + this.months[this.selectedMonth - 1].text + ' ' + this.yearlyDay;
            break;
        }

        if (rec.until) {            
          this.condition = 'until';
          const tempUntilDate = this.convertDateToUTC(new Date(rec.until));
          if (!this.different) {
            this.untilDate = tempUntilDate;
          } else {
            let date = tempUntilDate;
            if (this.different.less) {
              const res = this.gs.getNextDate(date);
              this.untilDate = new Date (res);
            } else {
              const res = this.gs.getPrevDate(date);
              this.untilDate = new Date(res);  
            }
          }
          customText += ' until ' + formatDate('MMMM D, YYYY', new Date(this.untilDate));
        } else if (rec.count) {
          this.condition = 'count';
          this.occurrences = rec.count;
          customText += ', ' + this.occurrences + ' times';
        } else {
          this.condition = 'never';
        }

        // add custom value
        this.repeatData = [...this.repeatData, { value: 'custom-value', text: customText }];
        setTimeout(() => {
          this.selectedRepeat = 'custom-value';
          this.selectedOption = 'custom-value';
        });
      } else if (rec.weekDays === 'MO,TU,WE,TH,FR') {
        this.selectedRepeat = 'weekday';
      } else {
        this.selectedRepeat = rec.repeat;
      }
    } else {
      this.resetCustomValues();
    }
    this.showCustomRepeat = this.selectedRepeat === 'custom' || this.selectedRepeat === 'custom-value';
  }

  // popuplate data for months
  populateMonthDays(month: number, type: string): void {
    const day30 = [2, 4, 6, 9, 11];
    const newValues = [];

    for (let i = 1; i <= 31; i++) {
      if (!(i === 31 && day30.includes(month)) && !(i === 30 && month === 2)) {
        newValues.push(i.toString());
      }
    }

    if (type === 'monthly') {
      this.monthlyDays = newValues;
      this.monthlyDay = '1';
    } else {
      this.yearlyDays = newValues;
      this.yearlyDay = 1;
    }
  }

  monthChange(ev: any): void {
    this.selectedMonth = ev.value;
    this.yearlyDay = 1;
    this.populateMonthDays(ev.value, 'yearly');
  }

  navigateTo(): void {
    if (!this.tempEvent) {
      return;
    }
    let rec = this.tempEvent.recurring;
    let d = new Date(this.tempEvent.start);
	d.setHours(0,0,0,0);
    let nextYear = 0;

    if (rec && rec.repeat === 'yearly') {
      if (d.getMonth() + 1 > +rec.month && d.getDay() > +rec.day) {
        nextYear = 1;
      }
      this.calendarSelectedDate = new Date(d.getFullYear() + nextYear, rec.month - 1, rec.day);
    } else {
		this.calendarSelectedDate = d;
    }
  }

  changeModalView(): void {
    switch (this.scheduleType) {
      case 'schedule':
        this.popupButtons = this.popupAddButtons;
        break;
      case 'leave':
        this.popupButtons = this.popupLeaveButtons;
        this.loadLeaveForm(this.tempLeave)
        break;
    }
  }

  changeView(): void {
    switch (this.view) {
      case 'week':
        this.zoom = false;
        if (this.sortFilters['scheduleTime'] !== 0) {
          this.sortFilters = { name: 1, minutes: 0, scheduleTime: 0};
        }
        this.setWeekView();
        break;
      case 'timelineMonth':
        this.showTimelineMonth();
        break;
      case 'weekSummary':
        this.showSummaryView();
        break;
      case 'timelineDay':
        this.sortFilters = { name: 0, minutes: 0, scheduleTime: -1};
        this.showDayView();
        break;
      case 'calMonth':
        this.calView = {
          calendar: {
            type: 'month',
            labels: true,
          },
        };
        break;
    }
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
    this.isTimelineView = false;
    if (this.zoom) {
      this.zoomIn();
    } else {
      this.zoomOut();
    }
    this.navigateToCurrentDate();
  }

  showDayView() {
    this.calView = {
      timeline: { 
        type: 'day',
        timeCellStep: 120,
        timeLabelStep: 120,
      }
    }
  }
  // updateWeekView() {
  // this.analytics.logEvents("zoom_scheduler");
  //   if (this.zoom) {
  //     this.zoomOut();
  //   } else {
  //     this.zoomIn();
  //   }
  //   this.navigateToCurrentDate();
  // }

  showTimelineMonth() {
    this.hidePrint = true;
    this.isTimelineView = true;
      this.calView = {
        timeline: {
          type: 'month',
          eventList: true,
        },
      };
  }

  showSummaryView() {
    this.calView = {
		timeline: {
		  type: 'week',
		  eventList: true,
		},
	  };
  }

  zoomOut() {
    this.zoom = false;
    this.hidePrint = false;
    this.calView = {
      timeline: {
        type: 'week',
        eventList: true
      },
    };
  }

  onEventClick($event) {
    this.analytics.logEvents("edit_schedule");
    if(this.loading) {
      return
    }
    if(this.showOnlyPublishedSchs) {
      if (this.gs.touchEnabledDevices) {
        this.tooltipTimeText($event.event)
      } else {
        return true
      }
    } else {
    this.isEdit = true;
    this.tempEvent = $event.event.original ? $event.event.original : $event.event;
    this.eventForForm = $event.event.original ? $event.event.original : $event.event;
    const resource: any = this.myResources.find((r) => r.id === this.tempEvent.resource[0]);
    this.selectedScheduleId = $event.event.id;
    this.selectedScheduleStatus = $event.event.is_unpublished_schedule;
    // recurring event
    if (this.tempEvent.recurring) {
      this.isEditingRecurringSchedule = true;
      this.originalRecurringEvent = $event.event['original'];
      this.eventOccurrence = { ...$event.event };
    } else {
      this.isEditingRecurringSchedule = false;
      this.originalRecurringEvent = {};
    }

    // fill popup form with event data
    this.loadPopupForm($event.event);

    this.setControls($event);

    // set popup options
    this.popupHeaderText = '<div class="sch-username">Edit ' + resource?.name + '\'s hours</div><div class="employee-shifts-day">' +
      formatDate('DDD, MMM DD', new Date($event.date)) + '</div>';
    this.popupButtons = this.popupEditButtons;
    this.disableEnableAddUpdateOfPopupViaProperty();
    this.popupAnchor = $event.domEvent.currentTarget;
    this.popup.open();
    this.scrollToBottom();
  }
  }

  setControls($event) {
    this.scheduleType = 'schedule';
    if (this.isEdit && Array.isArray($event.event.resource) && $event.event.resource.length > 1) {
      setTimeout(() => {
        this.participants = $event.event.resource;
      }, 20);
    } else if ($event.event.resource) {
      const resourceId = $event.event.resource;
      this.participants = Array.isArray(resourceId) ? resourceId[0] : resourceId;
      const selectedUser = this.myResources.filter((x) => x.id == resourceId);
      this.usersList = selectedUser;

      if (selectedUser && selectedUser[0]) {
        let res = null;
      }
    }
  }

  // openAddPopup($event) {
  //   // this.analytics.logEvents("add_scheduler");
  //   this.isEdit = false;
  //   this.tempEvent = {
  //     allDay: false,
  //     end: this.calendarStartDate,
  //     id: 'mbsc_101',
  //     resource: null,
  //     start: this.calendarStartDate,
  //   };
  //   this.popupHeaderText = 'Add Schedule';
  //   this.popupButtons = this.popupAddButtons;
  //   this.popupAnchor = $event.target;
  //   this.untilDate = null;
  //   this.loadPopupForm(this.tempEvent);
  //   this.popup.open();
  // }

  onEventCreated($event) {
  }

  
  getLeaves(resourceId) {
    this.loadingLeaves = true;
    const proceedBtn: HTMLElement = document.getElementsByClassName('proceedBtn').item(0) as HTMLElement;
    proceedBtn?.classList?.add("disable-btn");
    const dateUrl =
      '?start_date=' + new Date(this.minStartTime).toISOString() + '&end_date=' + new Date(this.maxDate.setHours(0,0,0,0)).toISOString();
    this.schedulerService
      .getLeaves(dateUrl, this.sharedRegion, resourceId)
      .then((response: any) => {
        this.leavesOfSelectedResource = response.leaves;
      })
      .catch((error) => {
        this.gs.showToastError(error?.message);
      })
      .finally(() => {
        this.loadingLeaves = false;
        proceedBtn?.classList.remove("disable-btn");
      });
  }

  disableEnableAddUpdateOfPopupViaProperty() {
    if (this.popupButtons.length !== 0) {     
      this.popupButtons[0].disabled = this.popEventLoading;
    }
  }

  disableEnableAddUpdateOfPopupViaClass() {
    const proceedBtn: HTMLElement = document.getElementsByClassName('proceedBtn')?.item(0) as HTMLElement;
    if (this.popEventLoading) {
      proceedBtn?.classList?.add("disable-btn");
    } else {
      proceedBtn?.classList?.remove("disable-btn");
    }
  }

  getSchedules() {
   if (this.sharedRegion !==0 && this.sharedRegion !=null) {
  
  this.loading = true;
  this.gettingSchs = true
  let resources = [];
   this.filterOn=(this.sharedRegion)?{'region_id': this.sharedRegion}:null;
    const dateUrl =
      '?start_date=' + new Date(this.calendarStartDate).toISOString() + '&end_date=' + new Date(this.calendarEndDate).toISOString();
      this.schedulerService
      .getSchedules(this.searchOn, this.filterOn, dateUrl, this.showOnlyPublishedSchs)
      .then((response) => {
        resources = response.users;
        // console.log( this.sortFilters['minutes'] == 0);
        // if (!(this.form.controls.role.value?.length > 0) || this.sortFilters['minutes'] == 0) {
        //   this.myResources = response.users;
        // }
        for (let res of resources) { Object.assign(res, {minutes: 0}) }
        this.myEvents = response.schedules
        this.myInvalids = response.leaves;
        this.isTimeOffNoti = response.is_timeoff_notification;
        this.isOpenSwapNoti = response.is_open_swap_notification ? true : false;
        this.enablePublish = response.is_unpublished_schedule || response.is_unpublished_leaves;
        this.allEvents = this.myEvents.slice();
        this.myInvalids.forEach(e => {
          e.start = new Date(e.start as any);
          e.end = new Date(e.end as any);
          e.cssClass = e.isPublished ? 'published_leave' : 'unpublished_leave'
        });
        this.allInvalids = this.myInvalids.slice();
        this.emptySearchResults = resources?.length === 0 && (this.searchOn || this.filters.role || this.filters.tag)? true : false;
        this.emptyResults = resources?.length === 0 && !this.searchOn && !this.filters.tag && !this.filters.role ? true : false;
        this.setEmpty();
        this.filter();
        this.filterInvalids();
      })
      .catch((error) => {
      })
      .finally(() => {
        // console.log(this.sortFilters);
        // for (const key in this.sortFilters) {
        //   if (this.sortFilters[key] && this.sortFilters[key] !== 0 && key !== 'minutes') {
        //       this.onSort(this.sortFilters[key], key);
        //       break;
        //   }
        // }
        this.loading = false;
        this.gettingSchs = false;
        // this.removeClass() //for fixing colors in print mode
        setTimeout(() => {
          this.myResourcesCopy = JSON.parse(JSON.stringify(resources));
          if (this.form.controls.role.value?.length > 0 && this.form.controls.tag.value?.length > 0) {
            this.filterByRole()
            setTimeout(() => {
              this.filterByTags();
            }, 20);   
          } else if (this.form.controls.role.value?.length > 0) {
            this.filterByRole();
          } else if (this.form.controls.tag.value?.length > 0) {
            this.filterByTags();
          } else {
            this.checkHoursCount();
          }
        });
        this.myEvents.forEach(e => { e.isPublished = !e.is_unpublished_schedule });
        setTimeout(() => { this.schedulesOfUserExitsOrNot(); });
      });
    } else {
      this.myResources = []
      this.myEvents = []
    }
  }
  schedulesOfUserExitsOrNot() {
    let allEvs = this.calendarInst?.getEvents(new Date(this.calendarStartDate), new Date(this.calendarEndDate))
    let allLeaves = this.calendarInst.getInvalids(new Date(this.calendarStartDate), new Date(this.calendarEndDate))
    for (let res of this.myResourcesCopy ) {
      res.isSchedules = allEvs.some(sch => sch.resource[0] === res.id);
      res.isLeaves = allLeaves.some(leave => leave.resource === res.id);
    }
  }

  deleteSchedule() {
    this.popEventLoading = true;
    this.disableEnableAddUpdateOfPopupViaClass();
    const data = { id: this.selectedScheduleId, is_unpublished_schedule: this.selectedScheduleStatus, region_id: this.sharedRegion };
    this.schedulerService
      .deleteSchedule(data)
      .then((response: any) => {
        this.deleteEvent(this.tempEvent);
        this.checkHoursCount(this.myResources)
        this.gs.showToastSuccess(response?.message);
        this.enablePublish = response.is_unpublished_schedule;
      })
      .catch((error) => {
		this.gs.showToastError(error?.message);
      })
      .finally(() => {
        this.popEventLoading = false;
        this.disableEnableAddUpdateOfPopupViaClass();
        this.schedulesOfUserExitsOrNot();
        this.popup.close();
      });
  }

  extractHoursAndMins(start, end,){
    this.minutes = (end.getTime() - start.getTime()) / (1000 * 60)
    return this.minutes
  }
  async addSchedule(event) {
    event.is_unpublished_schedule = true;
    event.isPublished = false;
    this.popEventLoading = true;
    this.disableEnableAddUpdateOfPopupViaClass();
    await this.schedulerService
      .addSchedule(event, this.sharedRegion)
      .then((response: any) => {
      setTimeout(() => {
        if (event.recurringException?.length > 0) {
          this.getSchedules(); // called to cater jump issue (maybe related to AZAL-1628)
        } else {
        event.id = response?.data?.id;
        event.start = new Date(event.start).toISOString();
        event.end = new Date(event.end).toISOString();      
          this.allEvents = [...this.allEvents, event];
          this.checkHoursCount(this.myResources)
          this.filter();
          this.filterInvalids();
          this.schedulesOfUserExitsOrNot();
        }
        }, 20);
        // if (this.pausedEvent && this.pausedRecurringEvent) {
        //   this.updateSchedule(this.pausedRecurringEvent.event)
        // }
        if (!this.loading) {
          this.gs.showToastSuccess(response?.message);
          this.enablePublish = true
          // this.closePopup()
          // this.popup.close();
          // this.navigateTo(); //we are allowing user to add schedule only on the selected date so no need to navigate now
        }
      })
      .catch((error) => {
        error?.isOverlapping ?  this.gs.showToastWarning(error?.message, 'Overlapping Detected', 4) : this.gs.showToastError(error?.message);
        this.myEvents = this.myEvents.filter(obj => obj.id !== null);
        if (this.pausedEvent && this.pausedRecurringEvent) {
          this.pausedRecurringEvent.event.recurringException?.pop();
        }
      })
      .finally(() => {
        this.pausedEvent = null;
        this.pausedRecurringEvent = null;
        this.gettingSchs ? this.loading = true : this.loading = false;
        this.popEventLoading = false;
        this.disableEnableAddUpdateOfPopupViaClass();
      });
  }

  async addLeave(event) {
    this.popEventLoading = true;
    this.disableEnableAddUpdateOfPopupViaClass();
    await this.schedulerService
      .addLeave(event, this.sharedRegion)
      .then((response: any) => {
        event.id = response?.id;      
        if (response.otherDelSchs.length > 0) { 
          this.getSchedules()
        } else {
        setTimeout(async () => {
          await this.deleteAlreadyAddedSchedules(response.simpleDelSchs)
          this.allInvalids = [...this.allInvalids, event];
          response.simpleDelSchs.length > 0 ? this.checkHoursCount() : '';
          this.filterInvalids();
          this.filter();
        }, 20);
        }
        this.gs.showToastSuccess(response?.message);
        this.enablePublish = true
      })
      .catch((error) => {
        this.gs.showToastError(error?.message);
      })
      .finally(() => {
        this.popEventLoading = false;
        this.disableEnableAddUpdateOfPopupViaClass();
        this.closePopup();
      });
  }

  async deleteAlreadyAddedSchedules(deletedSchs) {
    this.allEvents = this.allEvents.filter(el => {
      return !deletedSchs.find(element => {
         return element.id === el.id && element.is_unpublished_schedule === el.is_unpublished_schedule;
      });
    });
  }

  updateSchedule(event) {
    this.popEventLoading = true;
    this.disableEnableAddUpdateOfPopupViaClass();
    event.isPublished = false;
    event['allDay'] = false;
    this.schedulerService
      .updateSchedule(event)
      .then((response: any) => {
        if (!event.recurringException) {
          event.start = new Date(event.start).toISOString();
          event.end = new Date(event.end).toISOString();
          this.allEvents = this.allEvents.filter((x) => x.id !== event.id);
          event.is_unpublished_schedule = true;
          event.id = response.unpublished_schedule_id ? response.unpublished_schedule_id : event.id;
          this.allEvents = [...this.allEvents, event];
          setTimeout(() => {
            this.checkHoursCount(this.myResources);
            this.schedulesOfUserExitsOrNot();
            this.filter();
          }, 20);
        }
        this.gs.showToastSuccess(response?.message);
        this.enablePublish = true
        if (!event.recurringException) {
          this.loading = false;
          this.popup.close();
          // this.navigateTo(); //now we are allowing user to add schedule only on the selected date so no need to navigate
        } else {
          this.popup.close();
          this.getSchedules();
        }
      })
      .catch((error) => {
    error.isOverlapping ?  this.gs.showToastWarning(error?.message, 'Overlapping Detected', 4) : this.gs.showToastError(error?.message);
    this.oldEvent ? this.myEvents.splice(this.myEvents.findIndex(ev => ev.id === event.id), 1, this.oldEvent) : '';
    this.myEvents = this.myEvents.filter(obj => obj.id !== null);
      })
      .finally(() => {
        this.pausedEvent = null;
        this.oldEvent = null;
        this.pausedRecurringEvent = null;
        this.popEventLoading = false;
        this.gettingSchs ? this.loading = true : this.loading = false;
        this.disableEnableAddUpdateOfPopupViaClass();
      });
  }

  publishSchedule(isSendNotification) {
    this.loading = true;
    this.schedulerService
      .publishSchedule(this.sharedRegion, isSendNotification)
      .then((response: any) => {
        this.gs.showToastSuccess(response?.message);
      })
      .catch((error) => {
        this.gs.showToastError(error?.message);
      })
      .finally(() => {
        this.loading = false;
        this.getSchedules()
      });
  }

  getLeaveTypes() {
    this.loading = true;
    this.schedulerService
      .getLeaveTypes()
      .then((response: any) => {
        this.repeatDataLeaves = response;
        // this.gs.showToastSuccess(response?.message);
      })
      .catch((error) => {
        this.gs.showToastError(error?.message);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  updateLeave(event) {
    this.popEventLoading = true;
    this.disableEnableAddUpdateOfPopupViaClass();
    this.schedulerService
      .updateLeave(event)
      .then((response: any) => {
        if (response.otherDelSchs.length > 0) { 
          this.getSchedules()
        } else {
        this.allInvalids = this.allInvalids.filter((x) => x.id !== event.id);
        event.isPublished = false;
        event.id = response.unpublishedLeaveId ? response.unpublishedLeaveId : event.id;
        this.allInvalids = [...this.allInvalids, event];
        setTimeout(() => {
          response.simpleDelSchs.length > 0 ? this.checkHoursCount() : '';
          this.filterInvalids();
        }, 20);
        }
        this.gs.showToastSuccess(response?.message);
        this.enablePublish = true
      })
      .catch((error) => {
        this.gs.showToastError(error?.message);
      })
      .finally(() => {
        this.popEventLoading = false;
        this.loading = false;
        this.disableEnableAddUpdateOfPopupViaClass();
        this.popup.close();
      });
  }

  deleteLeave() {
    this.popEventLoading = true;
    this.disableEnableAddUpdateOfPopupViaClass();
    const data = { id: this.selectedLeaveId, isPublished: this.tempLeave.isPublished, regionId: this.sharedRegion };
    this.schedulerService
      .deleteLeave(data)
      .then((response: any) => {
        this.deleteLeaveEvent(this.tempLeave);
        this.gs.showToastSuccess(response?.message);
        this.enablePublish = response.is_unpublished_leaves; // TODO: need to change this key on both FE and BE (use to enable/disable the publish button)
      })
      .catch((error) => {
        this.gs.showToastError(error?.message);
      })
      .finally(() => {
        this.popEventLoading = false;
        this.popup.close();
        this.disableEnableAddUpdateOfPopupViaClass();
      });
  }

  closePopup() {
    for (const d of this.weekDaysCheckBoxes) { d.checked = false; d.disabled = false; d.invalid = false }
    this.popup.close();
  }

  filter(): void {
    this.myEvents = this.allEvents;
  }
  filterInvalids(): void {
    this.myInvalids = this.allInvalids;
  }

  temp($event) {
  }

  onInit(event: any): void {
  }

  updateConfig(regionId) {
    if (!this.isSchedulingEnabled || !regionId) {
      return;
    }    
    this.pageLoading = true;
    this.dataService.getRegionConfig(true, regionId).then((config) => {
      this.weekStartDay = config?.week_start_day !== null ? config.week_start_day : this.companyWeekStartDay;     
      this.setDaysSeqAccToFirstDay(daysDoesnotRepeat, this.weekStartDay)
    }).finally(() => {
      this.calendarOptions.firstDay = this.weekStartDay;
      this.pageLoading = false;
    });
  }

  onPageLoading(event) {

    /* Use it to load data on demand */
    this.calendarStartDate = event?.firstDay;
    this.calendarEndDate = event?.lastDay;
    // this.sortFilters = { name: 1, minutes: 0};
    this.selectedDateWeekly = this.gs.getWeek(this.gs.getNextDate(new Date(event?.firstDay), 7), this.weekStartDay);
    let rangeEndDate = new Date( event?.lastDay.getFullYear(),  event?.lastDay.getMonth(),  event.lastDay.getDate() - 1, 0);
    this.rangeText = this.getFormattedRange(event?.firstDay, rangeEndDate);
    this.navigateToCurrentDate(event);

    if (!this.sharedRegion) {
      this.subscriptioSingle = this.dataService.SingleRegionId.subscribe((res: any) => {
        if (res !== this.sharedRegion) {
          this.storeLevelSettings ? this.updateConfig(res) : '';
          this.sharedRegion = res;
          if (!this.storeLevelSettings) {
            this.getSchedules();
          }
        } else {
          this.isSchedulingEnabled ? this.getSchedules() : '';
        }
      });
      if (!this.sharedRegion) {
        this.subscription = this.dataService.SharingRegionData.subscribe((res: any) => {
          if (res !== this.sharedRegion) {
            this.storeLevelSettings ? this.updateConfig(res) : '';
            this.sharedRegion = res;
            if (!this.storeLevelSettings) {
              this.getSchedules();
            }
          } else {
            this.isSchedulingEnabled ? this.getSchedules() : '';
          }
        });
      }
    } else {
      this.isSchedulingEnabled ? this.getSchedules() : '';
    }
  }

  getFormattedRange(start: any, end: any): string {
    return formatDate('MMM, YYYY', new Date(start)) +
      (end && !this.checkMonths(start, end) ? (' - ' + formatDate('MMM, YYYY', new Date(end))) : '');
  }
  checkMonths(start: any, end: any) {
    return start.getMonth() == end.getMonth() 
  }

  setCheckedItems(isChecked, i) {
    if (isChecked) {
      this.weekDays[i].checked = true;
      this.weeksArray.push(isChecked);
    } else {
      this.weekDays[i].checked = false;
      this.weeksArray.pop();
    }
  }

  ngOnInit(): void {
    this.filtersCopy = JSON.parse(JSON.stringify(this.sortFilters));
    this.sortFilters = { name: 1, minutes: 0, scheduleTime: 0};
    this.filters = {role: null, tag: null};
    this.isFiltered = {role: false, tag: false};
    this.showSideBar = false;
    this.showSideBarHistory = false;
    this.printView = false;
    this.opacity = avatarOpacity;
    this.singleOrDouble = this.gs.touchEnabledDevices ? true : 'single'
    this.scheduleOpacity = jobOpacity;
    this.pausedEvent = null;
    this.pausedRecurringEvent = null;
    this.pageLoading = true;
    this.emptyResults = false;
    this.emptySearchResults = false;
    this.dataService
    .getConfigurations(false)
    .then((config) => {
      this.pageLoading = false;
      this.isHistory = config.company?.is_swap_shift == 1 || config.company.is_open_shift == 1 ? true : false;
      this.roleConfig = config.role?.modules;
      this.nameConfig = config.company?.custom_names;
      this.weekStartDay = config.company?.timesheet?.week_start_day ? config.company?.timesheet.week_start_day : 0;
      this.companyWeekStartDay = this.weekStartDay;
      this.isSchedulerNotification = config.company?.is_scheduler_notification
      this.isSchedulingEnabled = config.company.is_scheduler === 1 && this.roleConfig.Schedules.enabled;
      this.isTimeOff = config.company.is_timeoff === 1;
      this.calendarOptions.firstDay = this.weekStartDay;
      this.storeLevelSettings = config.company?.store_level_settings == 1 ? true : false;
      this.setDaysSeqAccToFirstDay(daysDoesnotRepeat, this.weekStartDay)
      this.getLeaveTypes();
    })
    .finally(() => {
      this.changeView();
      this.selectedDateWeekly = this.gs.getWeek(this.gs.getNextDate(new Date(), 7), this.weekStartDay);
    });

    this.weeksArray = [];
    this.minDate = this.gs.getPrevDate(new Date(), 365);
    this.maxDate = this.gs.getNextDate(new Date(), 365);
    this.allEvents = [];
    this.myEvents = [];
    this.allInvalids = [];
    this.myInvalids = [];
    this.view = 'week';
    this.scheduleType = 'schedule';
    this.showFilterResponsive = false;
    this.gs.hideSplashScreen();
    this.populateMonthDays(1, 'monthly');
    this.populateMonthDays(1, 'yearly');
		this.form = this.fb.group({
			role: [],
      tag: []
		})  
  }

  setDaysSeqAccToFirstDay(days, weekStartDay) {
    let n = days.length;
    weekStartDay = weekStartDay % n; //if weekStartDay is greater than length of the array
    let firstXElms = days.slice(0, weekStartDay);
    let remainingElms = days.slice(weekStartDay, n);
    // Destructuring to create the desired array
    days = [ ...remainingElms, ...firstXElms ];
    days.forEach((day, i) => { day.buffer = i });
    this.weekDaysCheckBoxes = JSON.parse(JSON.stringify(days));
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  scrollToBottom(): void {
    setTimeout(() => {
      var myDiv = document.getElementById("scrollContent");
      myDiv !== null ? myDiv.scrollTop = myDiv?.scrollHeight : '';
    }, 10);
  }

  hasOverlap(args, inst) {
    return false;
    var events = inst ? inst.getEvents() : this.allEvents.slice(),
      newEvent = args.event,
      newEventStart = newEvent.start,
      newEventEnd = newEvent.end;

    for (var i = 0; i < events.length; ++i) {
      let event = events[i],
        eventStart = event.start,
        eventEnd = event.end;

      if (
        ((newEventStart <= eventStart && newEventEnd > eventStart) || (newEventStart >= eventStart && newEventStart < eventEnd)) &&
        event.id != newEvent.id
      ) {
        if (newEvent.job_id === event.job_id) {
          this.gs.showToastError('Job is overlapping');
          return true;
        }
      }
    }
    return false;
  }

  saveTempLeave() {
    this.tempLeave.leaveTypeId = this.selectedLeaveOption;
    this.tempLeave.title = this.repeatDataLeaves.find(elm => elm.value === this.selectedLeaveOption)?.text ;
    this.tempLeave.start = new Date(this.leaveStartDate);
    this.tempLeave.end = new Date(this.leaveEndDate);
    this.tempLeave.allDay = true;
    this.tempLeave.color = null;
    // this.tempLeave.id = null;
    // this.tempLeave.isPublished = false;
    if (this.isEdit) {
      this.updateLeave(this.tempLeave)
    } else {
      this.tempLeave.isPublished = false;
      this.addLeave(this.tempLeave);
    }
  }

  registerTemplLeave() {
    this.leaveTemplateSubmitted = true;
    this.templateSubmitted = false;
    if (this.popEventLoading) {
      return;
    }
    if (this.leaveForm && this.leaveForm.valid) {
      if (this.leaveStartDate == null) {
        return;
      }
      if (this.leaveStartDate == null) {
        return;
      }     
      this.saveTempLeave(); 
    }
  }

  registerTempl() {
    this.templateSubmitted = true;
    this.leaveTemplateSubmitted = false;
    if (this.popEventLoading) {
      return;
    }
    if (this.templateForm && this.templateForm.valid) {
      if (this.startDateOfSch == null) {
        return;
      }
      if (this.endDateOfSch == null) {
        return;
      }
      const start = new Date(this.startDateOfSch);
      const end = new Date(this.endDateOfSch);

      if (start.toString() == end.toString()) {
        return;
      }
      const timedifference = (end.getTime() - start.getTime()) / 1000;
      if ((this.selectedRepeat === 'custom' || this.selectedRepeat === 'custom-value') && timedifference > 86400) {  // 24 hours
        return;
      }
      this.saveEvent();
    }
  }

  getCustomErrorDate(form, field: string) {
    if (!form) {
      return;
    }
    const formCtrl = form.control;
    const ctrl = formCtrl.get(field);
    let message = '';
    if (ctrl) {
      if (ctrl.value == null) {
        message = this.errorMessages[field]['required'];
        return message;
      }
      const start = new Date(this.startDateOfSch);
      const end = new Date(this.endDateOfSch);
      if ((start.toString() == end.toString())) {
        message = this.errorMessages[field]['sameDates'];
        return message;
      }
      const timedifference = (end.getTime() - start.getTime()) / 1000;
      if ((this.selectedRepeat === 'custom' || this.selectedRepeat === 'custom-value') && timedifference > 86400) {  // 24 hours
        message = this.errorMessages[field]['recurring'];
        return message;
      }
    }

  }

  getErrorMessage(form, field: string) {
    if (!form) {
      return;
    }
    const formCtrl = form.control;
    let message = '';
    if (formCtrl) {
      const ctrl = formCtrl.get(field);
      if (ctrl && ctrl.errors) {
        for (const err in ctrl.errors) {
          if (!message && ctrl.errors[err]) {
            message = this.errorMessages[field][err];
          }
        }
      }
      if (ctrl && ctrl.disabled) {
        message = this.errorMessages[field]['required'];
      }
    }
    return message;
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

  openPicker(isEndDate) {
    if (isEndDate) {
      this.pickerInst.setActiveDate('end');
    }
    this.pickerInst.open();
  };
  openUntilPicker() {
    this.untilPickerInst.open();
  };

  defaultTime(args: any): any {
    const d = args.start;
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 9);
    const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 17);
    return {
        title: formatDate('hh:mm A', start) + ' - ' + formatDate('hh:mm A', end),
        start,
        end,
        resource: args.resource
    };
  }

  helpingText() {
    return { title: 'Pasting...'}
  }

  isCornerGraveyard(data, key = null) {
    let event = data.original;
    const isGraveyard = new Date(event.start as any).getDate() !== new Date(event.end as any).getDate()
    const startsInPrevOrEndsInNextWeek = new Date(event.start as any).getTime() < new Date(this.calendarStartDate).getTime() ||
                                         new Date(event.end as any).getTime() > new Date(this.calendarEndDate).getTime();
    const cond = new Date(event[key] as any).getDate() !== new Date(data.date).getDate()
    return (isGraveyard && startsInPrevOrEndsInNextWeek && cond);
  }

    // changed print logic - used filter concept - we were having empty rows issue previously on making header sticky.
    async printCal(allOrScheduledOnly): Promise<void> {
      // temp hack to fix a graveyard scheule issue in print (if schedule ends at 12am last week)
      const originalEvents = [...this.myEvents];
      const eventsForPrint = originalEvents.filter((event) => {
        const isGraveyard = new Date(event.start as any).getDate() !== new Date(event.end as any).getDate()
        const isRecurring = event.recurring;
        const endsAt12am = new Date(event.end as any).getTime() === new Date(this.calendarStartDate).getTime();        
        return !(isGraveyard && !isRecurring && endsAt12am);
      });
      this.myEvents = [...eventsForPrint];
      this.analytics.logEvents("scheduler_print_button");
      const originalResources = [...this.myResources];
      // let dummyLastObj = { name: '', isSchedules: true, isLeaves: true, isLastRow: true}
      // this.myResources = [...this.myResources, dummyLastObj]
      // this.printView = true
      // setTimeout(async () => {
        if (allOrScheduledOnly === 'onlyScheduled') {
          // this.onlyScheduled = true;
          this.analytics.logEvents("scheduler_print_onlyScheduled");
          this.myResources = this.myResources.filter((resource) => resource.isSchedules || resource.isLeaves)
          // await this.showHideRowsInPrint('events', 'mbsc-timeline-row', 'mbsc-schedule-event', 'mbsc-schedule-invalid'); // hide event row with no event
          // await this.showHideRowsInPrint('resources', 'mbsc-timeline-resource', 'noSchedules', null); // hide resource row with noSchedules class
          this.calendarInst.print();
          setTimeout(() => {
            this.myResources = originalResources;
          }, 2000);
          // setTimeout(() => {
          //   this.myResources = this.myResources.filter((item) => !item.isLastRow);
          // }, 1000);
          // this.printView = false;
          // await this.showHideRows('events', 'mbsc-timeline-row', '.mbsc-schedule-event');
          // await this.showHideRows('resources', 'mbsc-timeline-resource', '.noSchedules');
        } else {
          // this.onlyScheduled = false;
          // this.myResources = originalResources
          this.analytics.logEvents("scheduler_print_all");
          await this.calendarInst.print();
          // this.printView = false;
          // await this.showHideRowsInPrint('events', 'mbsc-timeline-row', 'mbsc-schedule-event', 'mbsc-schedule-invalid');
          // await this.showHideRowsInPrint('resources', 'mbsc-timeline-resource', 'noSchedules', null);
          // setTimeout(() => {
          //   this.myResources = this.myResources.filter((item) => !item.isLastRow);
          // }, 1000);
        }
        // this.onlyScheduled = false;
        this.displayPopup = false;
      // }, 800);
    }

  showHideRowsInPrint(ent, targetClass, innerClass, secondInnerClass) {
    let rows, child, child2, grandchild;    
    rows = document.getElementsByClassName(targetClass) as any
    for (let i = 0; i < rows.length; i++) {
      const elem = rows[i];
      child = elem.children?.item(0)
      grandchild = child?.children.item(0)
      if(ent === 'events') { //if no event exist in a row - hide that row
        child2 = elem.children.item(1)
        let isLeave = child2?.classList?.contains(secondInnerClass);
        if(grandchild === null && !isLeave) {
          this.onlyScheduled ? elem?.classList?.add('forPrint') : elem?.classList?.remove('forPrint');
        }
      } else if (ent === 'resources' && grandchild?.classList.contains(innerClass)) { //if noSchedules class applied on resource - hide it
        this.onlyScheduled ? elem?.classList.add('forPrint') : elem?.classList.remove('forPrint');
      }
    }
  }

  //not using this function in new print f
  showHideRows(ent, targetClass, innerClass) {
    let rows, grandchild;    
    rows = document.getElementsByClassName(targetClass) as any
    for (let i = 0; i < rows.length; i++) {
      const elem = rows[i];
      grandchild = elem.querySelector(innerClass)
      if (!this.printView) {
        elem.style.borderBottom === 'none' ? elem.style.borderBottom = '1px solid #e6e6e6': '';
        elem.style.height = '4.5em';
      } else {
        if ((grandchild !== null && ent === 'resources') || (grandchild === null && ent !== 'resources')) {
          elem.style.height = '0px';
          elem.style.minHeight = '0px';
          elem.style.borderBottom = 'none';
        }
      }
    }
  }

  setCopyText() {
    this.copyText = "<span>This action is <span class='colored-text'>irreversible</span>. Are you sure?<span>" +
    "<br><br><span class='purple-txt'>Note: The copied schedules will be <span class='colored-text'> unpublished </span> in the new week.</span>";
  }

  formatDate(date) {
    const month = date.toLocaleString('default', { month: 'long'});
    const day = date.toLocaleString('default', { day: 'numeric'});
    return month + ' ' + day;
  }

  hideShowPopup() {
    this.displayPopup = !this.displayPopup
    this.displayPopupCopy = false;
  }
  hideShowPopupCopy() {
    this.displayPopupCopy = !this.displayPopupCopy;
    this.displayPopup = false;
    setTimeout(() => {
      let el = document.getElementById('copyLabel') as HTMLElement;
      if (el) {
        el.click();
      }
    },100);
  }
  removeClass() {
    //to fix color in print mode
    var elems = document.querySelectorAll(".mbsc-timeline-event");
    elems.forEach(el => {
      el.classList.remove("mbsc-schedule-event");
    });
  }

  closeFilter(key) {
		this.form.controls[key].setValue(this.filters?.[key]);
	}

  getTagsToolTip(arr) {
    let res = arr.slice(1, arr.length).map(x=> {return x.tag});
    return res.join(', ');
  }

  onSort(val, key, data = null) {
    this.gs.logEvents('scheduler_' + key + '_sort');
    this.sortFilters = JSON.parse(JSON.stringify(this.filtersCopy));
    this.sortFilters[key] = val;  
    data = data ? data : this.myResources;
    if (val == -1) {
      data.sort(( a, b ) => a[key].toLowerCase() < b[key].toLowerCase() ? 1 : -1 )
    } else if (val == 1) {
      data.sort(( a, b ) => a[key].toLowerCase() > b[key].toLowerCase() ? 1 : -1 )
    }
    setTimeout(() => {
      this.myResources = [...data];
    });
  }

  onSortNum(val, key, data = null) {
    this.gs.logEvents('scheduler_' + key + '_sort');
    data = data ? data : this.myResources;
    this.sortFilters = JSON.parse(JSON.stringify(this.filtersCopy));
    this.sortFilters[key] = val;  
    if (val == -1) {
      data.sort(( a, b ) => a[key] < b[key] ? 1 : -1 )
    } else if (val == 1) {
      data.sort(( a, b ) => a[key] > b[key] ? 1 : -1 )
    }
    setTimeout(() => {
      this.myResources = [...data];
    });
  }

  onEnter(key) {
		this[key].applyEnter();
	}

	applyFilterMulti(key) {
    this.gs.logEvents('users_filtered_by_' + key + '_scheduler')
		let val = this.form.controls[key].value;
		if (val && val.length > 0) {
			this.isFiltered[key] = true;
			this.filters[key] = val;
		} else {
			this.filters[key] = null;
			this.isFiltered[key] = false;
		}
    this.filterBy(key);
	}

  filterBy(key) {
    switch (key) {
      case 'tag':
        this.filterByTags()
      break;
      case 'role':
        this.filterByRole()
      break;
      default:
        this.filterByRole()
    }
  }

	removeFilter(key) {
		this.filters[key] = null;
		this.isFiltered[key] = false;
    for (const key in this.filters) {
      if (this.filters[key]) {
        key == 'tag' ? this.filterByTags() : this.filterByRole();
       return;
      }
    }
    let res = JSON.parse(JSON.stringify(this.myResourcesCopy));
    setTimeout(() => {
      this.myResources = [...res];
      this.emptySearchResults = this.searchOn && (this.myResources?.length === 0 || ("id" in this.myResources[0] == false)) ? true : false;
      this.emptyResults = !this.searchOn && (this.myResources?.length === 0 || ("id" in this.myResources[0] == false)) ? true : false;
      this.setEmpty();
      this.checkHoursCount();
    },160);	
  }
  
  filterByRole() {
    let arr = JSON.parse(JSON.stringify(this.filters?.tag ? this.myResources: this.myResourcesCopy));
    let res = this.filters['role'] == null ? arr : arr.filter(user => this.form.controls['role'].value.includes(user['role_id']));
    this.checkHoursCount(res);
    setTimeout(() => {
      this.emptySearchResults = this.myResources?.length === 0 || ("id" in this.myResources[0] == false) ? true : false;
      this.setEmpty();
    },160);
  }

  filterByTags() {
    let arr = JSON.parse(JSON.stringify(this.filters?.role ? this.myResources: this.myResourcesCopy));
    let res;
    if (this.filters['tag'] == null) {
      res = arr;
    } else {
      let filteredOn = this.form.controls['tag'].value;
      res = arr.filter(user => {
        let userTagIds = user.tags.map(x => { return x.id })
        let exists = filteredOn.some(r => userTagIds.includes(r));
        return exists ? user : null;
      });
    }
    this.checkHoursCount(res);
    setTimeout(() => {
      this.emptySearchResults = this.myResources?.length === 0 || ("id" in this.myResources[0] == false) ? true : false;
      this.setEmpty();
    },160);
  }

  setEmpty() {
    if (this.emptySearchResults) {
      this.myResources = [{}]
    }
  }

  ngOnDestroy() {
    if(this.subscription){
		this.subscription?.unsubscribe();
    }
    this.subscriptioSingle?.unsubscribe();
	  }

  onPublishClick() { 
    this.analytics.logEvents("publish_schedule");
	  this.dialogService.open(ConfirmModalComponent,{hasBackdrop: true, closeOnBackdropClick: false, context: {heading: 'Are you sure?', subHeading: 'Once published, mobile users will be able to see this schedule.', dynamicElems: { isSchedulerNotification: this.isSchedulerNotification == 1 ? true : false }}
	   }).onClose.subscribe(res => {
	    if (res.isActionConfirmed) {
	      this.publishSchedule(res.isSendNotification);
	    }
	  });
  }

  isCurrentDay(day) {
    if (day.date.getTime() == this.todaysDate) {
      return true;
    } else {
      return false;
    }
  }

  sortResWrtScheduleTime(val, key, data = null) {
    this.sortFilters = JSON.parse(JSON.stringify(this.filtersCopy));
    this.sortFilters[key] = val; 
    data = data ? data : JSON.parse(JSON.stringify(this.filters?.role || this.filters?.tag ? this.myResources: this.myResourcesCopy));

    if (val == -1) {
    data.sort((a, b) => {
      let evs: any = this.calendarInst.getEvents(new Date(this.calendarStartDate), new Date(this.calendarEndDate))
      const eventsA = evs.filter(item => item.resource.includes(a.id))
      const eventsB = evs.filter(item => item.resource.includes(b.id))

      const startTimeA = Math.min(...eventsA.map(event => new Date(event.start).getTime())); //smallest start time
      const startTimeB = Math.min(...eventsB.map(event => new Date(event.start).getTime()));
      // breaking points
      if (startTimeA === undefined && startTimeB === undefined) return 0;
      if (startTimeA === undefined) return 1
      if (startTimeB === undefined) return -1;

      return startTimeA - startTimeB;
    });
    }

    this.myResources = [...data];
    setTimeout(() => {
      this.emptySearchResults = this.myResources?.length === 0 || ("id" in this.myResources[0] == false) ? true : false;
      this.setEmpty();
    }, 100);
  }

  goToDayView(event) {
    this.gs.logEvents('scheduler_day_view_viewed_from_date_header')
    this.calendarSelectedDate = event.date;
    this.view = 'timelineDay';
    this.changeView();
  }

  copyShortcut(data) {
    this.gs?.logEvents('schedule_copied_via_shortcut');
    this.animate = false;
    this.copiedObject = JSON.parse(JSON.stringify(data.original));
    setTimeout(() => { this.animate = true }, 20);
    // this.notify.toast({
    //   message: 'Schedule copied',
    //   duration: 800,
    //   display: 'center'
    //   // color: 'success',
    // });
  }

  pasteCopiedEvent(event) {
    this.gs?.logEvents('copied_schedule_pasted');
    let copiedStartTime = new Date(this.copiedObject.start) as any;
    let copiedEndTime = new Date(this.copiedObject.end) as any;
    let dayDifference = this.gs.getDayDifference(copiedStartTime, copiedEndTime);

    let tempStartTime = new Date(event.start) as any;
    let tempEndTime = new Date(event.end) as any;

    let startDateTime = new Date(tempStartTime.getFullYear(), tempStartTime.getMonth(), tempStartTime.getDate(), copiedStartTime.getHours(), copiedStartTime.getMinutes()) as any;
    let endDateTime = new Date(tempEndTime.getFullYear(), tempEndTime.getMonth(), tempEndTime.getDate() + dayDifference, copiedEndTime.getHours(), copiedEndTime.getMinutes()) as any;

    let tempEvent = {
      id: null,
      title: this.copiedObject.title,
      allDay: false,
      is_unpublished_schedule: true,
      color: this.copiedObject.color,
      start: startDateTime,
      end: endDateTime,
      // recurring: null,
      resource: [event.resource]
    }
    this.addSchedule(tempEvent);
  }

  clearClipboard() {
    this.gs?.logEvents('copied_schedule_cleared');
    this.copiedObject = null;
  }
  onRecEditModeChange() {
    this.gs?.logEvents('recurring_edit_mode_changed');
    const tempEvent2 = JSON.parse(JSON.stringify(this.tempEvent));
    if (tempEvent2.recurring) {
      switch (this.recurringEditMode) {
        case 'current':
          // delete tempEvent2.id;
          delete tempEvent2.recurring;
          delete tempEvent2.recurringException;
          this.eventForForm = tempEvent2;
          break;
        case 'following':
          let events = this.breakRecurringEvent();
          this.eventForForm = events.newEvent;
          break;
        case 'all':
          this.eventForForm = this.tempEvent;
          break;
      }
    }
    this.setStartAndEndDates()
  }
  getInfoText() {
    return this.recurringEditModes.find(item => item.value === this.recurringEditMode)?.info;   
  }

  isOriginalEventRecurring() {
    if (this.originalRecurringEvent == null) {
      return false
    } else {
      return Object.keys(this.originalRecurringEvent).length !== 0
    }
  }

  toggleAnalytics() {
    const eventName = 'scheduler_' + this.view.replace("timeline", "") + '_view_toggled'
    this.gs.logEvents(eventName)
  }

  isFilterClosedOnSmallDevices() {
    const filterPanel: HTMLElement = document.getElementsByClassName('filter-mainwrapper').item(0) as HTMLElement;   
    if (this.gs.isRespMode && filterPanel) {
      return false;
    } else {
      return true;
    }
  }
}
function allevents(arg0: string, allevents: any) {
  throw new Error('Function not implemented.');
}
 

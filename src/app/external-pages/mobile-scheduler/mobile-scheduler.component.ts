import { Component, OnInit, ViewChild } from '@angular/core';
import { ExternalPagesService } from 'src/app/core/services/external-pages.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { avatarOpacity, oneDayInMs } from 'src/constants';
import {
  formatDate,
  MbscCalendarEvent,
  MbscEventcalendar,
  MbscEventcalendarOptions,
  MbscEventcalendarView,
  momentTimezone,
} from '@mobiscroll/angular';
import moment from 'moment-timezone';

momentTimezone.moment = moment;

@Component({
  selector: 'app-mobile-scheduler',
  templateUrl: './mobile-scheduler.component.html',
  styleUrls: ['./mobile-scheduler.component.scss']
})
export class MobileSchedulerComponent implements OnInit {
  static loggedInUserId: any;
  public mobSch = MobileSchedulerComponent;
  constructor(
    private gs: GeneralService,
    private service: ExternalPagesService,
  ) { 
    this.loading = false;
    this.pageLoading = false;    
  }

  loading: boolean;
  calendarStartDate: any;
  calendarEndDate: any;
  searchOn: any;
  myResources: any;
  // allInvalids: any;
  allEvents: any;
  dateInput: any;
  selectedDate: any;
  pageLoading: boolean;
  weekStartDay: number;
  rangeText: any;
  minDate: any;
  maxDate: any;
  opacity: number;
  isLoggedInUserSchExist: boolean = true;
  allEventsIncludingRecuring: any;
  calendarSelectedDate: any;
  isLoggedInUserOnleave: boolean = false;
  schedulesOptions = [{ name: "Your Schedules", id: 0 }, { name: "Other Schedules", id: 1 }]
  selectedOption = 1;
  noEvents: boolean = false;
  public momentPlugin = momentTimezone;
	@ViewChild('myEventCalendar', { static: false })
	calendarInstance: MbscEventcalendar;
  myEvents: MbscCalendarEvent[] = [];
  leaves: MbscCalendarEvent[] = [];
  calView: MbscEventcalendarView;
  calendarOptions: MbscEventcalendarOptions = {
    clickToCreate: false,
    dragToCreate: false,
    dragToMove: false,
    dragToResize: false,
    firstDay: 0,
    touchUi: true,
    view: {
      calendar: { type: 'week' },
      agenda: { type: 'day'}
      // agenda: { type: 'month'}
    },
    timezonePlugin: momentTimezone,
    dataTimezone: 'utc',
    displayTimezone: 'local',
    onSelectedDateChange: (event, inst)	=> {
      console.log('event:::: ', event);
      this.selectedDate = event.date;
      this.loggedInUserSchs();
    }
  };
  view: any;

  ngOnInit(): void {
    this.opacity = avatarOpacity;
    // this.pageLoading = true;
    this.calendarOptions.firstDay = this.gs.getWeekStartDay();
    this.selectedDate = new Date();
    // this.minDate = this.gs.getPrevDate(new Date(), 10);
    // this.maxDate = this.gs.getNextDate(new Date(), 10);
    this.allEvents = [];
    this.myEvents = [];
    this.leaves = [];
    this.gs.hideSplashScreen();
    // this.pageLoading = false;
  }

  loggedInUserSchs() {
    this.isLoggedInUserOnleave = false;
    for (let i = 0; i < this.leaves.length; i++) {
      let leave = this.leaves[i];
      let start = new Date(leave.start as any) 
      let end = new Date(leave.end as any)
      let date = new Date(start.getTime());
      while (date >= start && date <= end) {
        if ((date.getDate() === this.selectedDate.getDate()) && leave.resource[0] === this.mobSch.loggedInUserId) {
          this.isLoggedInUserOnleave = true;
          break;
        } else {
          this.isLoggedInUserOnleave = false;
          date = new Date(date?.getTime() + oneDayInMs);
        }
      }
      if (this.isLoggedInUserOnleave) {
        break;
      }      
    }
    // this.isLoggedInUserOnleave = this.allEventsIncludingRecuring.some(ev => 
    //   (new Date(ev.start as any).getDate() === this.selectedDate.getDate()
    //   || new Date(ev.end as any).getDate() === this.selectedDate.getDate())
    //   && ev.resource[0] === this.mobSch.loggedInUserId
    //   && ev.isLeave === true);

    this.noEvents = this.allEventsIncludingRecuring.every(ev => (new Date(ev.start as any).getDate() !== this.selectedDate.getDate() && new Date(ev.end as any).getDate() !== this.selectedDate.getDate())) && this.leaves.length == 0;
    this.isLoggedInUserSchExist = this.allEventsIncludingRecuring.some(ev => (new Date(ev.start as any).getDate() === this.selectedDate.getDate() || new Date(ev.end as any).getDate() === this.selectedDate.getDate()) && ev.resource[0] === this.mobSch.loggedInUserId);
    const item = document.querySelector(".mbsc-schedule-date-header") as HTMLElement;
    item.style.display = this.isLoggedInUserSchExist || this.isLoggedInUserOnleave ? 'none' : 'block';
  }

  getResourceDetails(resId: number): any {
    return this.myResources.find((r) => r.id === resId);
  }

  getSchedules() {
    setTimeout(() => {
    this.loading = true;
    });
    const dateUrl =
      '?start_date=' + new Date(this.calendarStartDate).toISOString() + '&end_date=' + new Date(this.calendarEndDate).toISOString() + '&others=' + this.selectedOption;
    this.service
      .getSchedules(this.searchOn, dateUrl, false)
      .then((response) => {
        this.myResources = response.users;
        // this.myEvents = response.schedules
        this.allEvents = response.schedules;
        this.allEvents.forEach(sch => { sch.isLeave = false });
        this.mobSch.loggedInUserId = response.logged_in_user_id;
        this.leaves = response.leaves;
        this.leaves.forEach(leave => {
          leave.start = new Date(leave.start as any);
          leave.end = new Date(leave.end as any);
          let resourceArray = []; // used array of resource to make it consistent with schedules array
          resourceArray.push(leave.resource)
          leave.resource = resourceArray;
          leave.isLeave = true;
          this.allEvents.push(leave)
        });
        this.myEvents = this.allEvents;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setTimeout(() => {
          this.getAllEvents()
          this.loading = false;
        });
      });
  }

  getAllEvents() {
    this.allEventsIncludingRecuring = this.calendarInstance.getEvents(new Date(this.calendarStartDate), new Date(this.calendarEndDate))
    this.loggedInUserSchs()
  }

  onPageLoading(event) {
    this.calendarStartDate = event.firstDay;
    this.calendarEndDate = event.lastDay;
    let rangeEndDate = new Date( event.lastDay.getFullYear(),  event.lastDay.getMonth(),  event.lastDay.getDate() - 1, 0);
    this.rangeText = this.getFormattedRange(event.firstDay, rangeEndDate);
    this.getSchedules();
  }

  getFormattedRange(start: any, end: any): string {
    return formatDate('MMM, YYYY', new Date(start)) +
      (end && !this.checkMonths(start, end) ? (' - ' + formatDate('MMM, YYYY', new Date(end))) : '');
  }
  checkMonths(start: any, end: any) {
    return start.getMonth() == end.getMonth() 
  }

  orderMyEvents(event1, event2) {    
    if (event1.resource[0] === MobileSchedulerComponent.loggedInUserId && event2.resource[0] !== MobileSchedulerComponent.loggedInUserId) { return -1 }
    if (event1.resource[0] !== MobileSchedulerComponent.loggedInUserId && event2.resource[0] === MobileSchedulerComponent.loggedInUserId) { return 1 }

    if (new Date(event1.start).getTime() > new Date(event2.start).getTime()) { return 1 }
    if (new Date(event1.start).getTime() < new Date(event2.start).getTime()) { return -1 }
  }
}

import { NgModule } from '@angular/core';
import { TimesheetsRoutingModule } from './timesheets-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TimesheetPageComponent } from './pages/timesheet-page/timesheet-page.component';
import { CommonModule } from '@angular/common';
import { TimesheetDailyViewComponent } from './components/timesheet-daily-view/timesheet-daily-view.component';
import { TimesheetWeeklyViewComponent } from './components/timesheet-weekly-view/timesheet-weekly-view.component';
import { AddTimesheetEntryComponent } from './components/add-timesheet-entry/add-timesheet-entry.component';
import { TimesheetDetailsComponent } from './components/timesheet-details/timesheet-details.component';

@NgModule({
  declarations: [
    TimesheetPageComponent,
    TimesheetDailyViewComponent,
    TimesheetWeeklyViewComponent,
    AddTimesheetEntryComponent,
    TimesheetDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TimesheetsRoutingModule,
  ]
})
export class TimesheetsModule { }

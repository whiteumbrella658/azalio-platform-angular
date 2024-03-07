import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimesheetPageComponent } from './pages/timesheet-page/timesheet-page.component';

const routes: Routes = [
  { path: '', component: TimesheetPageComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimesheetsRoutingModule { }

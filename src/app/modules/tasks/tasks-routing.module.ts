import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DailyReportComponent } from './components/daily-report/daily-report.component';
import { TasksReportComponent } from './components/tasks-report/tasks-report.component';
import { TasksPageComponent } from './pages/tasks-page/tasks-page.component';

const routes: Routes = [
  { path: '', component: TasksPageComponent},
  { path: 'report', component: TasksReportComponent},
  { path: 'dailyReport', component: DailyReportComponent},
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule { }

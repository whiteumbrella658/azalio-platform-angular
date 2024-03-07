import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasksRoutingModule } from './tasks-routing.module';
import { TasksPageComponent } from './pages/tasks-page/tasks-page.component';
import { TasksTableViewComponent } from './components/tasks-table-view/tasks-table-view.component';
import { TasksTableHeadComponent } from './components/tasks-table-head/tasks-table-head.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TaskCommentsComponent } from './components/task-comments/task-comments.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AssignUserComponent } from './components/assign-user/assign-user.component';
import { TasksReportComponent } from './components/tasks-report/tasks-report.component';
import { AddTaskComponent } from './components/add-task/add-task.component';
import { DailyReportComponent } from './components/daily-report/daily-report.component';


@NgModule({
  declarations: [
    TasksPageComponent,
    TasksTableViewComponent,
    TasksTableHeadComponent,
    TaskCommentsComponent,
    AssignUserComponent,
    TasksReportComponent,
    AddTaskComponent,
    DailyReportComponent
  ],
  imports: [
    CommonModule,
    TasksRoutingModule,
    SharedModule,
    InfiniteScrollModule
  ]
})
export class TasksModule { }

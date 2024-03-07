import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchedulerRoutingModule } from './scheduler-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SchedulerPageComponent } from './pages/scheduler-page/scheduler-page.component';


@NgModule({
  declarations: [
    SchedulerPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SchedulerRoutingModule
  ]
})
export class SchedulerModule { }

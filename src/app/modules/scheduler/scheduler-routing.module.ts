import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchedulerPageComponent } from './pages/scheduler-page/scheduler-page.component';

const routes: Routes = [
  { path: '', component: SchedulerPageComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchedulerRoutingModule { }

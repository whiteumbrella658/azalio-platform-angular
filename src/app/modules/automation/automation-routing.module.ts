import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutomationPageComponent } from './pages/automation-page/automation-page.component';

const routes: Routes = [
  { path: '', component: AutomationPageComponent},
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutomationRoutingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AutomationRoutingModule } from './automation-routing.module';
import { AutomationPageComponent } from './pages/automation-page/automation-page.component';
import { AutoTableComponent } from './components/auto-table/auto-table.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddAutomationComponent } from './components/add-automation/add-automation.component';
import { AutomationDetailsComponent } from './components/automation-details/automation-details.component';


@NgModule({
  declarations: [
    AutomationPageComponent,
    AutoTableComponent,
    AddAutomationComponent,
    AutomationDetailsComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    AutomationRoutingModule
  ]
})
export class AutomationModule { }

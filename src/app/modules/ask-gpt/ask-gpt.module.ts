import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { AskGPTRoutingModule } from './ask-gpt-routing.module';
import { AskGptPageComponent } from './pages/ask-gpt-page/ask-gpt-page.component';
import { GraphSectionComponent } from './components/graph-section/graph-section.component';
import { GraphComponent } from './components/graph/graph.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ResultSectionComponent } from './components/result-section/result-section.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { MyChartsComponent } from './pages/my-charts/my-charts.component';
import { EmpCommPageComponent } from './pages/emp-comm-page/emp-comm-page.component';
import { ResponsesPageComponent } from './pages/responses-page/responses-page.component';
import { CommSchedulesComponent } from './components/comm-schedules/comm-schedules.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { GptMessageComponent } from './components/gpt-message/gpt-message.component';
import { LegendsComponent } from './components/legends/legends.component';


@NgModule({
  declarations: [
    AskGptPageComponent,
    GraphSectionComponent,
    GraphComponent,
    ResultSectionComponent,
    SideMenuComponent,
    MyChartsComponent,
    EmpCommPageComponent,
    ResponsesPageComponent,
    CommSchedulesComponent,
    DataTableComponent,
    GptMessageComponent,
    LegendsComponent
  ],
  imports: [
    SharedModule,
    NgChartsModule,
    CommonModule,
    AskGPTRoutingModule
  ]
})
export class AskGPTModule { }

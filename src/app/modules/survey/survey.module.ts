import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';


import { SurveyRoutingModule } from './survey-routing.module';
import { CreateSurveyComponent } from './components/create-survey/create-survey.component';
import { AiSurveyPageComponent } from './pages/ai-survey-page/ai-survey-page.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SurveyResponsesComponent } from './pages/survey-responses/survey-responses.component';
import { ScheduleHistoryComponent } from './components/schedule-history/schedule-history.component';


@NgModule({
  declarations: [
    CreateSurveyComponent,
    AiSurveyPageComponent,
    SurveyResponsesComponent,
    ScheduleHistoryComponent
  ],
  imports: [
    NgChartsModule,
    CommonModule,
    SurveyRoutingModule,
    SharedModule
  ]
})
export class SurveyModule { }

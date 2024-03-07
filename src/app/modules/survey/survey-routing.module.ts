import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AiSurveyPageComponent } from './pages/ai-survey-page/ai-survey-page.component';
import { SurveyResponsesComponent } from './pages/survey-responses/survey-responses.component';

const routes: Routes = [
  { path: '', component: AiSurveyPageComponent},
  { path: 'history', component: SurveyResponsesComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SurveyRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommunicationPageComponent } from './pages/communication-page/communication-page.component';
import {ChatPageComponent} from './pages/chat-page/chat-page.component'
import { SurveyPageComponent } from './pages/survey-page/survey-page.component';

const routes: Routes = [
  { path: '', component: CommunicationPageComponent},
  { path: '', component: ChatPageComponent},
  { path: 'survey', component: SurveyPageComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunicationRoutingModule { }

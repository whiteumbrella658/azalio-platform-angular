import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunicationRoutingModule } from './communication-routing.module';
import { CommunicationPageComponent } from './pages/communication-page/communication-page.component';
import { NbChatModule } from '@nebular/theme';
import { MessagesListComponent } from './components/messages-list/messages-list.component';
import { NewMessageComponent } from './components/new-message/new-message.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChatListComponent } from './components/chat-list/chat-list.component';
import { AutocompleteInputComponent } from './components/autocomplete-input/autocomplete-input.component';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';
import { SurveyPageComponent } from './pages/survey-page/survey-page.component';
import { AddSurveyComponent } from './components/add-survey/add-survey.component';

@NgModule({
  declarations: [
    CommunicationPageComponent,
    MessagesListComponent,
    NewMessageComponent,
    ChatListComponent,
    AutocompleteInputComponent,
    ChatPageComponent,
    SurveyPageComponent,
    AddSurveyComponent,
  ],
  imports: [
    CommonModule,
    CommunicationRoutingModule,
    NbChatModule,
    SharedModule
  ],
  exports:[
    CommunicationPageComponent,
    MessagesListComponent,
    NewMessageComponent,
    ChatListComponent,
    AutocompleteInputComponent,
    ChatPageComponent,
  ]
})
export class CommunicationModule { }

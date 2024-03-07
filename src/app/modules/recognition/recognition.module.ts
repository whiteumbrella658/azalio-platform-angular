import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecognitionRoutingModule } from './recognition-routing.module';
import { RecognitionPageComponent } from './pages/recognition-page/recognition-page.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NewRewardComponent } from './components/new-reward/new-reward.component';
import { ExtraPointsComponent } from './components/extra-points/extra-points.component';
import { UserPointsTableViewComponent } from './components/user-points-table-view/user-points-table-view.component';
import { NewAnnouncementComponent } from './components/new-announcement/new-announcement.component';
import { GiftRequestsComponent } from './components/gift-requests/gift-requests.component';


@NgModule({
  declarations: [
    RecognitionPageComponent,
    NewRewardComponent,
    ExtraPointsComponent,
    UserPointsTableViewComponent,
    NewAnnouncementComponent,
    GiftRequestsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RecognitionRoutingModule
  ]
})
export class RecognitionModule { }

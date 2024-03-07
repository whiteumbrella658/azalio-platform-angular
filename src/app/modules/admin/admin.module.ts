import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { CustomerPageComponent } from './pages/customer-page/customer-page.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminHeaderComponent } from './components/admin-header/admin-header.component';
import { ImportTasksComponent } from './components/import-tasks/import-tasks.component';
import { EnablePlayComponent } from './components/enable-play/enable-play.component';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';


@NgModule({
  declarations: [
    CustomerPageComponent,
    AdminHeaderComponent,
    ImportTasksComponent,
    EnablePlayComponent,
    UserPageComponent,
    ResetPasswordComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }

import { NgModule } from '@angular/core';
import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { UserTableViewComponent } from './components/user-table-view/user-table-view.component';
import { CommonModule } from '@angular/common';
import { AddUserComponent } from './components/add-user/add-user.component';
import { AssignRegionTeamsComponent } from './components/assign-region-teams/assign-region-teams.component';
import { ImportUsersComponent } from './components/import-users/import-users.component';
import { ViewTemplateComponent } from './components/view-template/view-template.component';
import { ViewErrorsComponent } from './components/view-errors/view-errors.component';
import { AddLabelComponent } from './components/add-label/add-label.component';


@NgModule({
  declarations: [
    UserPageComponent,
    UserTableViewComponent,
    AddUserComponent,
    AssignRegionTeamsComponent,
    ImportUsersComponent,
    ViewTemplateComponent,
    ViewErrorsComponent,
    AddLabelComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UsersRoutingModule,
  ],
  exports: [
    UserTableViewComponent
  ]
})
export class UsersModule { }

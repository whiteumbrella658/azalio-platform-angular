import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ConfigurationSettingsRoutingModule} from './configuration-settings-routing.module';
import { WorkShiftsComponent } from './components/work-shifts/work-shifts.component';
import { RequiredFeaturesComponent } from './components/required-features/required-features.component';
import { RolesPermissionsComponent } from './components/roles-permissions/roles-permissions.component';
import { GeneralPageComponent } from './components/general-page/general-page.component';
import {SettingsPageComponent} from './pages/settings-page/settings-page.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomizeLabelsComponent } from './components/customize-labels/customize-labels.component';
import {SettingsGuard} from './../../core/guards/settings.guard';
import { StoresDetailsComponent } from './components/stores-details/stores-details.component';
import { AddStoreComponent } from './components/add-store/add-store.component';
import { AddShiftComponent } from './components/add-shift/add-shift.component';
import { AdvancedComponent } from './components/advanced/advanced.component';


@NgModule({
  declarations: [
    WorkShiftsComponent,
    RequiredFeaturesComponent,
    RolesPermissionsComponent,
    GeneralPageComponent,
    SettingsPageComponent,
    CustomizeLabelsComponent,
    StoresDetailsComponent,
    AddStoreComponent,
    AddShiftComponent,
    AdvancedComponent,
  ],
  imports: [
    CommonModule,
    ConfigurationSettingsRoutingModule,
    SharedModule
  ],
  providers: [ 
   SettingsGuard
],
})
export class ConfigurationSettingsModule { }

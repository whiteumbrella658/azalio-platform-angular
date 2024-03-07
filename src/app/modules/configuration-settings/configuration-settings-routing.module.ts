import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkShiftsComponent } from './components/work-shifts/work-shifts.component';
import { CustomizeLabelsComponent } from './components/customize-labels/customize-labels.component';
import { RequiredFeaturesComponent } from './components/required-features/required-features.component';
import { RolesPermissionsComponent } from './components/roles-permissions/roles-permissions.component';
import { StoresDetailsComponent } from './components/stores-details/stores-details.component';
import { GeneralPageComponent } from './components/general-page/general-page.component';
import {SettingsPageComponent} from './pages/settings-page/settings-page.component';
import {SettingsGuard} from './../../core/guards/settings.guard';
import { AdvancedComponent } from './components/advanced/advanced.component';



const routes: Routes = [
  { path: '', component: SettingsPageComponent,
  children:[
    { path:'', redirectTo:'required-features'}, //canActivate: [SettingsGuard],
    { path: 'general-page', canDeactivate: [SettingsGuard], component: GeneralPageComponent },
    { path: 'roles-permissions',  canDeactivate: [SettingsGuard], component: RolesPermissionsComponent,},
    { path: 'rules',  canDeactivate: [SettingsGuard], component: WorkShiftsComponent },
    // { path: 'customize-labels',  canDeactivate: [SettingsGuard], component: CustomizeLabelsComponent },
    { path: 'required-features',  canDeactivate: [SettingsGuard], component: RequiredFeaturesComponent },
    { path: 'stores-details',  canDeactivate: [SettingsGuard], component: StoresDetailsComponent },
    { path: 'advanced-settings',  canDeactivate: [SettingsGuard], component: AdvancedComponent },
  ]
 },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationSettingsRoutingModule { }

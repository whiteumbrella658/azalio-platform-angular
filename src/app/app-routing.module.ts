import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { StoreAuthGuard } from './core/guards/store.auth.guard';
import { StoreAppSchedulerComponent } from './external-pages/store-app-scheduler/store-app-scheduler.component';
import { PrivacyPolicyComponent } from './modules/entry/pages/privacy-policy/privacy-policy.component';
import { PageNotFoundComponent } from './shared/pages/page-not-found/page-not-found.component';
import { UnauthorizedComponent } from './shared/pages/unauthorized/unauthorized.component';
import { AccessPointComponent } from './external-pages/access-point/access-point.component';
import { MobileSchedulerComponent } from './external-pages/mobile-scheduler/mobile-scheduler.component';
import { AcessMobileSchedulerComponent } from './external-pages/acess-mobile-scheduler/acess-mobile-scheduler.component';

const routes: Routes = [
  { path: '', redirectTo: 'home/login-page', pathMatch: 'prefix' },
  { path: '401', component: UnauthorizedComponent },
  { path: '404', component: PageNotFoundComponent },
  { path: 'store-app-scheduler/401', component: UnauthorizedComponent},
  { path: 'store-app-scheduler/404', component: PageNotFoundComponent},
  { path: 'mobile-scheduler/401', component: UnauthorizedComponent},
  { path: 'mobile-scheduler/404', component: PageNotFoundComponent},
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'access-point', component:AccessPointComponent },
  { path: 'access-mobile-scheduler', component : AcessMobileSchedulerComponent},
  
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'home',
    loadChildren: () => import('./modules/entry/entry.module').then((m) => m.EntryModule),
  },
  {
    path: 'timesheet',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/timesheets/timesheets.module').then((m) => m.TimesheetsModule),
  },
  {
    path: 'scheduler',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/scheduler/scheduler.module').then((m) => m.SchedulerModule),
  },
  {
    path: 'organization',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/users/users.module').then((m) => m.UsersModule),
  },
  {
    path: 'tasks',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/tasks/tasks.module').then((m) => m.TasksModule),
  },
  {
    path: 'communication',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/communication/communication.module').then((m) => m.CommunicationModule),
  },
  {
    path: 'survey',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/survey/survey.module').then((m) => m.SurveyModule),
  },
  {
    path: 'recognition',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/recognition/recognition.module').then((m) => m.RecognitionModule),
  },
  {
    path: 'automation',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/automation/automation.module').then((m) => m.AutomationModule),
  },
  {
    path: 'askq',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/ask-gpt/ask-gpt.module').then((m) => m.AskGPTModule),
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/configuration-settings/configuration-settings.module').then((m) => m.ConfigurationSettingsModule),
  },
  {
     path:'store-app-scheduler',
     component: StoreAppSchedulerComponent, 
     canActivate: [StoreAuthGuard]
  },
  {
    path: 'mobile-scheduler',
    canActivate: [StoreAuthGuard],
    component: MobileSchedulerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}

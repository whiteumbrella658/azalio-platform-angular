import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcceptInvitePageComponent } from './pages/accept-invite-page/accept-invite-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { SetupPageComponent } from './pages/setup-page/setup-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'login-page' },
  { path: 'setup', component: SetupPageComponent },
  { path: 'login-page', component: LoginPageComponent },
  { path: 'accept-invitation', component: AcceptInvitePageComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntryRoutingModule {}

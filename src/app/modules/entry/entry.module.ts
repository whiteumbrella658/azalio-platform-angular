import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { EntryRoutingModule } from './entry-routing.module';
import { NbDialogModule } from '@nebular/theme';
import { SharedModule } from 'src/app/shared/shared.module';
import { SetupPageComponent } from './pages/setup-page/setup-page.component';
import { AcceptInvitePageComponent } from './pages/accept-invite-page/accept-invite-page.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AnimateIconsComponent } from './components/animate-icons/animate-icons.component';
import { SignupCardComponent } from './components/signup-card/signup-card.component';

@NgModule({
	declarations: [
		SignUpComponent,
		SignInComponent,
		ForgotPasswordComponent,
		ResetPasswordComponent,
		VerifyEmailComponent,
		SetupPageComponent,
		AcceptInvitePageComponent,
		PrivacyPolicyComponent,
		LoginPageComponent,
  AnimateIconsComponent,
  SignupCardComponent,
	],
	imports: [EntryRoutingModule, CommonModule, SharedModule, NbDialogModule.forChild()],
})
export class EntryModule {}

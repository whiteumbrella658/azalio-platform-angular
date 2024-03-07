import { MbscModule } from '@mobiscroll/angular';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { config } from '../environments/configuration';
import { NgChartsModule } from 'ng2-charts';
import {
	NbThemeModule,
	NbLayoutModule,
	NbDatepickerModule,
	NbTimepickerModule,
	NbDateAdapterService,
	NbSidebarModule,
	NbDialogModule,
	NbDialogService,
	NbWindowService,
	NbMenuModule,
	NbWindowModule
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';

import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { CoreModule } from './core/core.module';
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';
import { NbDateFnsDateModule } from '@nebular/date-fns';
import { StoreAppSchedulerComponent } from './external-pages/store-app-scheduler/store-app-scheduler.component';
import { AccessPointComponent } from './external-pages/access-point/access-point.component';
import {CommunicationModule} from './modules/communication/communication.module';
import { MobileSchedulerComponent } from './external-pages/mobile-scheduler/mobile-scheduler.component';
import { AcessMobileSchedulerComponent } from './external-pages/acess-mobile-scheduler/acess-mobile-scheduler.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

// @ts-ignore
import { } from '@types/googlemaps';
//import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics';

@NgModule({
	declarations: [AppComponent, HeaderComponent, FooterComponent, StoreAppSchedulerComponent,  AccessPointComponent, MobileSchedulerComponent, AcessMobileSchedulerComponent],
	imports: [ 
   InfiniteScrollModule,
    MbscModule,  
		FormsModule,
		BrowserModule,
		CoreModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		NbThemeModule.forRoot({ name: 'default' }),
		NbDatepickerModule.forRoot(),
		NbDateFnsDateModule.forRoot({ format: 'dd/MM/yyyy' }),
		NbTimepickerModule.forRoot(),
		NbSidebarModule.forRoot(),
		NbDialogModule.forChild(),
		NbMenuModule.forRoot(),
		NbWindowModule.forRoot(),
		NbLayoutModule,
		NbEvaIconsModule,
		NgChartsModule,
		AngularFireModule.initializeApp({
			apiKey: config.API_KEY,
			authDomain: config.AUTH_DOMAIN,
			projectId: config.PROJECT_ID,
			storageBucket: config.STORAGE_BUCKET,
			messagingSenderId: config.MESSAGING_SENDER_ID,
			appId: config.APP_ID,
			measurementId: config.MEASUREMENT_ID,
		}),
		AngularFireAuthModule,
		AngularFirestoreModule,
		AngularFireMessagingModule,
		CommunicationModule
	//	AngularFireAnalyticsModule,
	],
	//exports: [CommunicationModule],
	providers: [NbDateAdapterService],
	bootstrap: [AppComponent],
})
export class AppModule {
}

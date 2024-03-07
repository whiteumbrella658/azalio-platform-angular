import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interceptorProviders } from '../interceptors';
import { ApiService } from './http/api.service';
import { SharedModule } from '../shared/shared.module';
import { MapsService } from './services/maps.service';
import { LocalStorageService } from './services/local-storage.service';
import { AuthGuard } from './guards/auth.guard';
import { DataSharedService } from './services/data-shared.service';



@NgModule({
  declarations: [
    ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [SharedModule],
  providers: [interceptorProviders, ApiService, MapsService, LocalStorageService, AuthGuard, DataSharedService],
})
export class CoreModule { }

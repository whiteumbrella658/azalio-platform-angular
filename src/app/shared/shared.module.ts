import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NbSidebarModule, NbLayoutModule, NbAccordionModule, NbButtonGroupModule, NbButtonModule, NbCalendarModule, NbCardModule, NbCheckboxModule, NbInputModule, NbRadioModule, NbSelectModule, NbToggleModule, NbUserModule, NbTreeGridModule, NbDatepickerModule, NbTimepickerModule, NbTooltipModule, NbContextMenuModule, NbPopoverModule, NbSpinnerModule, NbToastrModule, NbCalendarRangeModule, NbTagModule, NbAutocompleteModule, NbProgressBarModule, NbBadgeModule, NbDialogService, NbDialogModule, NbWindowService, NbWindowModule, NbStepperModule, NbListModule } from '@nebular/theme';
import { MatTableModule } from '@angular/material/table';
import { MatTreeModule } from '@angular/material/tree';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { SubmitButtonComponent } from './form-components/submit-button/submit-button.component';
import { TaskDropdownComponent } from './form-components/task-dropdown/task-dropdown.component';
import { TimezoneDropdownComponent } from './form-components/timezone-dropdown/timezone-dropdown.component';
import { TimerInputComponent } from './form-components/timer-input/timer-input.component';
import { ErrorMessageComponent } from './form-components/error-message/error-message.component';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbIconModule   } from '@nebular/theme';
import { RegionDropdownComponent } from './form-components/region-dropdown/region-dropdown.component';
import { HttpClientModule } from '@angular/common/http';
import {NbFormFieldModule} from '@nebular/theme';
import { TextInputComponent } from './form-components/text-input/text-input.component';
import { TimePipe } from './pipes/time.pipe';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { NoRecordsComponent } from './components/no-records/no-records.component';
import { NoSearchRecordsComponent } from './components/no-search-records/no-search-records.component';
import { MatButtonModule } from '@angular/material/button';
import { NestedTableComponent } from './components/nested-table/nested-table.component';
import { RolesDropdownComponent } from './form-components/roles-dropdown/roles-dropdown.component';
import { TextPopupComponent } from './components/text-popup/text-popup.component';
import { ConfirmPopupComponent } from './components/confirm-popup/confirm-popup.component';
import { PopoverComponent } from './components/popover/popover.component';
import { PhoneNumberPipe } from './pipes/phone-number.pipe';
import { LoaderComponent } from './components/loader/loader.component';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { ImageAuthPipe } from './pipes/image-auth.pipe';
import { OnlineStatusComponent } from './components/online-status/online-status.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { LocationPipe } from './pipes/location.pipe';
import { CountryCodeDropdownComponent } from './form-components/country-code-dropdown/country-code-dropdown.component';
import { AutoFocusDirective } from './directives/autofocus.directive';
import { IntroModalComponent } from './components/intro-modal/intro-modal.component';
import { AutocompleteTagInputComponent } from './form-components/autocomplete-tag-input/autocomplete-tag-input.component';
import { SchedulerComponent } from './components/scheduler/scheduler.component';
import { MbscModule } from '@mobiscroll/angular';
import { UserSearchPipe } from './pipes/user-search.pipe';
import { SearchPipe } from './pipes/search.pipe';
import { NumFormatterPipe } from './pipes/num-formatter.pipe';
import { RegionsTeamsPipe } from './pipes/regions-teams.pipe';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { DropdownComponent } from './form-components/dropdown/dropdown.component';
import { UserAutocompleteInputComponent } from './form-components/user-autocomplete-input/user-autocomplete-input.component';
import { UserAvatarComponent } from './components/user-avatar/user-avatar.component';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { GeoLocationComponent } from './components/geo-location/geo-location.component';
import { WhatNewModalComponent } from './components/what-new-modal/what-new-modal.component';
import { ButtonComponent } from './components/button/button.component';
import { RadioComponent } from './form-components/radio/radio.component';
import { DropdownMultiComponent } from './form-components/dropdown-multi/dropdown-multi.component';
import { NbDateFnsDateModule } from '@nebular/date-fns';
import { FilterPopupComponent } from './components/filter-popup/filter-popup.component';
import { SortComponent } from './components/sort/sort.component';
import { LeavesRequestComponent } from './components/leaves-request/leaves-request.component';
import { DaysPipe } from './pipes/days.pipe';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OpenSwapRequestComponent } from './components/open-swap-request/open-swap-request.component';
import { CircularProgressComponent } from './components/circular-progress/circular-progress.component';

export function playerFactory() {
	return player;
  }
@NgModule({
  declarations: [
    SubmitButtonComponent,
    ButtonComponent,
    TaskDropdownComponent,
    TimezoneDropdownComponent,
    TimerInputComponent,
    ErrorMessageComponent,
    RegionDropdownComponent,
    TextInputComponent,
    TimePipe,
    SidebarComponent,
    SearchInputComponent,
    NoRecordsComponent,
    NoSearchRecordsComponent,
    NestedTableComponent,
    RolesDropdownComponent,
    TextPopupComponent,
    ConfirmPopupComponent,
    PopoverComponent,
    PhoneNumberPipe,
    LoaderComponent,
    ImageAuthPipe,
    OnlineStatusComponent,
    UnauthorizedComponent,
    PageNotFoundComponent,
    LocationPipe,
    CountryCodeDropdownComponent,
    AutoFocusDirective,
    IntroModalComponent,
    AutocompleteTagInputComponent,
    SchedulerComponent,
    UserSearchPipe,
    SearchPipe,
    NumFormatterPipe,
    RegionsTeamsPipe,
    ConfirmModalComponent,
    DropdownComponent,
    UserAutocompleteInputComponent,
    UserAvatarComponent,
    GeoLocationComponent,
    WhatNewModalComponent,
    RadioComponent,
    DropdownMultiComponent,
    FilterPopupComponent,
    SortComponent,
    LeavesRequestComponent,
    DaysPipe,
    OpenSwapRequestComponent,
    CircularProgressComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    NbLayoutModule,
    NbSidebarModule,
    NbUserModule,
    NbInputModule,
    NbCheckboxModule,
    NbButtonModule,
    NbButtonGroupModule,
    NbCalendarModule,
    NbSelectModule,
    NbCardModule,
    NbListModule,
    NbAccordionModule,
    NbCheckboxModule,
    NbToggleModule,
    NbRadioModule,
    NbTreeGridModule,
    NbDatepickerModule,
    NbSidebarModule,
    MatTableModule,
    MatTreeModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatCheckboxModule,
    NbCalendarRangeModule,
    NbTimepickerModule,
    NbEvaIconsModule,
    NbIconModule,
    NbFormFieldModule,
    NbTooltipModule,
    NbContextMenuModule,
    NbPopoverModule,
    NbSpinnerModule,
    NbTagModule,
    NbAutocompleteModule,
    NbToastrModule.forRoot(),
    MbscModule,
    NbProgressBarModule,
    NbBadgeModule,
    NbDateFnsDateModule,
    NbDialogModule.forChild(),
    NbWindowModule.forChild(),
    LottieModule.forRoot({ player: playerFactory }),
    NbStepperModule,
    DragDropModule
  ],
  exports: [
    NbLayoutModule,
    NbSidebarModule,
    NbUserModule,
    NbInputModule,
    NbCheckboxModule,
    NbButtonModule,
    NbButtonGroupModule,
    NbCalendarModule,
    NbSelectModule,
    NbCardModule,
    NbAccordionModule,
    NbCheckboxModule,
    NbToggleModule,
    NbRadioModule,
    NbTreeGridModule,
    NbDatepickerModule,
    NbSidebarModule,
    MatTableModule,
    MatTreeModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatCheckboxModule,
    NbCalendarRangeModule,
    FormsModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    SubmitButtonComponent,
    ButtonComponent,
    TaskDropdownComponent,
    TimezoneDropdownComponent,
    NbTimepickerModule,
    TimerInputComponent,
    ErrorMessageComponent,
    NbEvaIconsModule,
    NbIconModule,
    RegionDropdownComponent,
    HttpClientModule,
    NbFormFieldModule,
    TextInputComponent,
    TimePipe,
    NbTooltipModule,
    NbContextMenuModule,
    NbPopoverModule,
    SidebarComponent,
    SearchInputComponent,
    NbSpinnerModule,
    NoRecordsComponent,
    NoSearchRecordsComponent,
    NestedTableComponent,
    RolesDropdownComponent,
    TextPopupComponent,
    ConfirmPopupComponent,
    PopoverComponent,
    PhoneNumberPipe,
    LoaderComponent,
    NbToastrModule,
    ImageAuthPipe,
    OnlineStatusComponent,
    LocationPipe,
    CountryCodeDropdownComponent,
    AutoFocusDirective,
    NbTagModule,
    NbAutocompleteModule,
    AutocompleteTagInputComponent,
    MbscModule,
    SchedulerComponent,
    UserSearchPipe,
    NbProgressBarModule,
    NbBadgeModule,
    SearchPipe,
    NumFormatterPipe,
    RegionsTeamsPipe,
    NbDialogModule,
    ConfirmModalComponent,
    DropdownComponent,
    UserAutocompleteInputComponent,
    NbWindowModule,
    UserAvatarComponent,
    LottieModule,
    GeoLocationComponent,
    RadioComponent,
    DropdownMultiComponent,
    NbDateFnsDateModule,
    FilterPopupComponent,
    SortComponent,
    NbStepperModule,
    DragDropModule,
    NbListModule,
    CircularProgressComponent
  ]
})
export class SharedModule {}
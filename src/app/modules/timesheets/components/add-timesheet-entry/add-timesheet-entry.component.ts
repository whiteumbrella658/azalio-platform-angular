import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  SimpleChanges
} from '@angular/core';

import { FormGroup, FormBuilder, Validators, ValidatorFn, ValidationErrors, AbstractControlOptions, NgForm } from '@angular/forms';
import { TimesheetService } from '../../timesheet.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { avatarOpacity, timezoneMapping } from 'src/constants';
import { NbDialogRef } from '@nebular/theme';
import { apiUrl } from 'src/api-url';
import { ApiService } from 'src/app/core/http/api.service';

@Component({
  selector: 'app-add-timesheet-entry',
  templateUrl: './add-timesheet-entry.component.html',
  styleUrls: ['./add-timesheet-entry.component.scss'],
})
export class AddTimesheetEntryComponent implements OnInit, AfterViewChecked {
  @ViewChild('ngForm') ngForm: NgForm;

 // @Output() onFormSuccess: EventEmitter<null> = new EventEmitter<null>();
  @Input() user;
  @Input() timesheetData;
  @Input() selectedData;
  selectedRegionId:Number = null;
  selectedRegionTitle:any;
  selectedTimesheetEntryId: Number = null;
  AddTimesheetEntry: FormGroup;
  regions: any = [];
  maxAllowedSlotTime = 24 * 60;
  minAllowedSlotTime = 0;
  isEditMode: Boolean = false;
  userId: Number = null;
  userName: String = null;
  userColor: String;
  initialColor:String;
  userRole: String;
  loading: Boolean;
  nameConfig: any;
  timesheetConfig: any;
  isThirdShiftAllowed: boolean;
  timezoneMapping: { key: string; value: string }[];
  userRegionDefaultTimeZones: any;
  opacity: number;
  users: any;
  regionId:number;
  checkEntry:number;
  disable:boolean;
  isAddEntry: boolean;
  isNewAddEntry:boolean;
  isEditEntry:boolean;
  buttonLabel:string='Add';
  isOwnAddEditEntry: boolean = true;
  
  constructor(
    private cdRef: ChangeDetectorRef,
    private ref: NbDialogRef<AddTimesheetEntryComponent>,
    private dataService: DataSharedService,
    private fb: FormBuilder,
    private timeSheetService: TimesheetService,
    private gs: GeneralService,
    private http: ApiService,
  ) {
    this.timezoneMapping = timezoneMapping.slice();
  }

  ngOnInit(): void {
    this.disable=false;
    this.opacity = avatarOpacity; 
    this.dataService
      .getConfigurations(false)
      .then((config) => {
        this.nameConfig = config.company?.custom_names;
        this.maxAllowedSlotTime = config.company?.timesheet ? config.company.timesheet.shift_hours * 60 : 24 * 60;
        this.isThirdShiftAllowed = config.company?.timesheet.is_third_shift === 1 ? true : false;
        if (config.is_partner || config.role.role_id === 2 || config.role.role_title.includes('Account Owner')) {
          this.isOwnAddEditEntry = true;
        } else {
          this.isOwnAddEditEntry = config.company?.timesheet.is_edit_own === 1 ? true : false;
        }
      })
      .finally(() => {});

    this.addTimesheetEntryFormValues();
    if(this.isNewAddEntry){
      this.getUsers();
    }
  }
    // for setting default timzone
  getDefaultTimezone() {
    if(this.user){
    this.userRegionDefaultTimeZones = this.timeSheetService
      .DefaultTimezone(this.user?.userId, this.regionId)
      .then(
        (data) => {
          this.userRegionDefaultTimeZones = data;
        },
        (error) => {
          console.log('error in  getting defaultTimezone add-timesheetentry.comp.ts 72 :>>', error);
          console.log('------------------------------------------------');
        }
      )
      .finally(() => {
        // let timezone = this.userRegionDefaultTimeZones.filter((x) => this.regionId === x.region_id)
        // !this.timesheetData && this.AddTimesheetEntry.controls.timezone.setValue(timezone[0]?.default_timezone?.toUpperCase());
        let timezone=this.timezoneMapping.filter((x) => x.value === this.userRegionDefaultTimeZones[0]?.default_timezone);
       // console.log(timezone[0].key,"timezone");
        !this.timesheetData && this.AddTimesheetEntry.controls.timezone.setValue(timezone[0].key?timezone[0].key:'');
      });
    }

  }

  initData() {
    this.user = this.user;

    if (this.selectedData) {
      this.userName = this.selectedData.user_name;
      this.userId = this.selectedData.user_id;
      this.regionId=this.selectedData.region_id;
      this.selectedRegionId=this.selectedData.region_id;
      this.selectedRegionTitle=this.selectedData.region_title;
    }

    if (this.user) {
      this.userName = this.user.userName;
      this.userId = this.user.userId;
      this.userColor = this.user.userColor + this.opacity.toString();
      this.initialColor=this.user.userColor;
      this.userRole = this.user.userRole;
      const date = this.user.date;
      if (date) {
        date.setHours(0, 0, 0, 0);
        this.AddTimesheetEntry.controls.clockIn.setValue(this.user.date);
        //this.AddTimesheetEntry.controls.clockOut.setValue(this.user.date);
      }
    }else{
      let data = this.dataService.getSelectedFilter();
      if(data){
        this.regionId=data.id;
        this.selectedRegionId=data.id;
        this.selectedRegionTitle=data.name;
       // console.log()
      }
      const date=new Date();
      date.setHours(0, 0, 0, 0);
      this.AddTimesheetEntry.controls.clockIn.setValue(date);
      this.isNewAddEntry=true;
     // this.AddTimesheetEntry.controls.clockOut.setValue(date);
    }

    if (this.timesheetData) {
      this.buttonLabel='Update';
      this.isEditMode = true;
      const entry = this.timesheetData.entry;
      const storeTimezone = this.timesheetData.store_timezone;
      const result = this.timezoneMapping.filter((x) => x.value === entry.start_time_zone);
      let timezone;
      if (result?.length > 0) {
        timezone = result[0].key;
      }
      if(!entry.end_time){
       this.disable=true;
      }
      this.selectedTimesheetEntryId = entry.timesheet_id;
      this.AddTimesheetEntry.controls.timezone.setValue(timezone);
      this.AddTimesheetEntry.controls.clockIn.setValue(
        this.gs.changeTimezone(new Date(this.gs.getDateFromTimestamp(entry.start_time)), storeTimezone)
      );
      if (entry.end_time) {
        this.AddTimesheetEntry.controls.clockOut.setValue(
          this.gs.changeTimezone(new Date(this.gs.getDateFromTimestamp(entry.end_time)), storeTimezone)
        );
      }
      this.AddTimesheetEntry.controls.note.setValue(entry.change_note);
    }

    if (this.user && !this.timesheetData){
      this.isAddEntry=true;
      this.getDefaultTimezone()
    }
  }

  addTimesheetEntryFormValues = () => {
    this.AddTimesheetEntry = this.fb.group(
      {
        timezone: ['', Validators.required],
        clockIn: [null, Validators.required],
        clockOut: null,
        note: ['', Validators.maxLength(500)],
        user_id:null,
        region_id:null,
      },
      {
        validator: [this.timeValidator],
      } as AbstractControlOptions
    );
    this.updateValidations();
    this.initData();
  };
  updateValidations=()=> {
  if(this.userId==null){
   this.AddTimesheetEntry.controls.user_id.setValidators(Validators.required);
  }
  if(this.regionId ==null){
    this.AddTimesheetEntry.controls.region_id.setValidators(Validators.required);
  }
  }

  resetForm = () => {
    this.addTimesheetEntryFormValues();
    this.AddTimesheetEntry.reset(this.AddTimesheetEntry.value);
    this.selectedRegionId=null;
    this.selectedRegionTitle=null;
    this.isEditMode = false;
    this.selectedTimesheetEntryId = null;
    this.ngForm.resetForm();
  };

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  timeValidator: ValidatorFn = (group: FormGroup): ValidationErrors | null => {
    if((group.get('clockOut').value != null && group.get('clockOut').value !='')&&(group.get('clockIn').value != null && group.get('clockIn').value !='')){
    const tStart = new Date(group.get('clockIn').value);
    const tEnd = new Date(group.get('clockOut').value);
     
    tStart.setSeconds(0, 0);
    tEnd.setSeconds(0, 0);

    const differenceInMins = (tEnd.getTime() - tStart.getTime()) / 60000;
    let invalidTime, invalidThirdShift, invalidSlot, invalidMaxSlot;
    if (tStart.getTime() >= tEnd.getTime()) {
      invalidTime = true;
    } else if (!this.isThirdShiftAllowed) {
      const startDate = '' + tStart.getDate() + tStart.getMonth() + tStart.getFullYear();
      const endDate = '' + tEnd.getDate() + tEnd.getMonth() + tEnd.getFullYear();
      if (startDate !== endDate) {
        invalidThirdShift = true;
      }
    } else if (differenceInMins < this.minAllowedSlotTime) {
      invalidSlot = true;
    } else if (differenceInMins > this.maxAllowedSlotTime) {
      invalidMaxSlot = true;
    }

    let result = {};
    if (invalidTime) {
      result = {
        invalidTime,
      };
    } else if (invalidThirdShift) {
      result = {
        invalidThirdShift,
      };
    } else if (invalidSlot) {
      result = {
        invalidSlot,
      };
    } else if (invalidMaxSlot) {
      result = {
        invalidMaxSlot,
      };
    }

    if (Object.keys(result)?.length === 0) {
      tStart.setHours(0, 0, 0, 0);
      tEnd.setHours(23, 59, 0, 0);
      this.userId = this.userId;
    }
    return result === {} ? null : result;
  }
  return null;
  };
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.addEntry.currentValue !== changes.addEntry.previousValue ) {
     // this.isAddEntry=true;
      this.AddTimesheetEntry.controls.user.setValue(null);
     
    }
  }
  // ngOnChanges(changes: SimpleChanges) {
  // if (changes.selectedData && changes.selectedData.currentValue) {
  //   this.userName = changes.selectedData.currentValue.user_name;
  //   this.userId = changes.selectedData.currentValue.user_id;
  // }

  // if (changes.user && changes.user.currentValue) {
  //   this.userName = changes.user.currentValue.userName;
  //   this.userId = changes.user.currentValue.userId;
  //   this.userColor = changes.user.currentValue.userColor;
  //   this.userRole = changes.user.currentValue.userRole;
  //   const date = changes.user.currentValue.date;
  //   if (date) {
  //     date.setHours(0,0,0,0);
  //     this.preselectedDate = date.getTime();
  //     this.AddTimesheetEntry.controls.clockIn.setValue(changes.user.currentValue.date);
  //     this.AddTimesheetEntry.controls.clockOut.setValue(changes.user.currentValue.date);
  //   }

  // }

  // if (changes.timesheetData && changes.timesheetData.currentValue) {
  //   this.isEditMode = true;
  //   const entry = changes.timesheetData.currentValue.entry;
  //   const result = this.timezoneMapping.filter(x=> x.value === entry.start_time_zone);
  //   let timezone;
  //   if (result?.length > 0) {
  //     timezone = result[0].key
  //   }
  //   this.selectedTimesheetEntryId = entry.timesheet_id;
  //   this.AddTimesheetEntry.controls.timezone.setValue(timezone);
  //   this.AddTimesheetEntry.controls.clockIn.setValue(this.gs.getDateFromTimestamp(entry.start_time));
  //   this.AddTimesheetEntry.controls.clockOut.setValue(this.gs.getDateFromTimestamp(entry.end_time));
  //   this.AddTimesheetEntry.controls.note.setValue(entry.start_note);
  //   this.selectedJobId = changes.timesheetData.currentValue.job_id;
  //   this.selectedTaskId = changes.timesheetData.currentValue.task_id;
  // }
  // }


  submit(ngForm) {
    this.AddTimesheetEntry.controls.user_id.setValue(this.userId);

    if(this.isAddEntry){
    this.AddTimesheetEntry.controls.region_id.setValue(this.regionId);
    }
    if (ngForm.valid) {
      this.loading = true;
      if (this.isEditMode) {
        this.update(ngForm);
      } else {
        this.add(ngForm);
      }
    } else {
    }
  }

  update = async (ngForm) => {
    const timesheetEntry = this.createTimeSheetObject();
    timesheetEntry['timesheet_id'] = this.selectedTimesheetEntryId;
    try {
      const response: any = await this.timeSheetService.updateTimeSheetEntry(timesheetEntry);
      // this.onFormSuccess.emit(null);
      // this.resetForm();
      // ngForm.resetForm();
      this.gs.showToastSuccess(response?.message);
      this.close(true);
    } catch (error) {
      this.gs.showToastError(error.message);
      console.log(error);
    } finally {
      this.loading = false;
    }
  };

  add = async (ngForm) => {
    const timesheetEntry = this.createTimeSheetObject();
    try {
      const response: any = await this.timeSheetService.addTimeSheetEntry(timesheetEntry);
      // this.onFormSuccess.emit(null);
      // this.resetForm();
      // ngForm.resetForm();
      this.gs.showToastSuccess(response?.message);
      this.close(true);
    } catch (error) {
      this.gs.showToastError(error.message);
      console.log(error);
    } finally {
      this.loading = false;
    }
  };

  createTimeSheetObject = () => {
    const zone = this.AddTimesheetEntry.get('timezone').value;
    const timezone = this.timezoneMapping.filter((x) => x.key === zone)[0].value;
    const timesheetEntry = {
      user_id:this.userId,
      region_id: this.regionId,
      start_time: new Date(this.AddTimesheetEntry.get('clockIn').value).getTime() / 1000,
      note: this.AddTimesheetEntry.get('note').value,
      end_time: this.AddTimesheetEntry.get('clockOut').value?(new Date(this.AddTimesheetEntry.get('clockOut').value).getTime() / 1000):null,
      time_zone: timezone,
    };

    return timesheetEntry;
  };
  getUsers(){
this.users=[];
  }

  userChange(event) {
    if (this.AddTimesheetEntry.get('user').value !== '') {
      this.regions = event?.regions;
      if (event?.regions?.length === 1) {
        setTimeout(() => {
          this.AddTimesheetEntry.controls.region.setValue(this.regions[0]);
        }, 20);
      }
    } else {
      this.AddTimesheetEntry.controls.region.setValue(null);
    }
  }

  onTagSelectionChange($event) {
    this.regionId = $event;//$event.size > 0 ? Array.from($event) : '';
   // this.AddUserForm.controls.regionTeams.setValue(value);
  }

  close(refresh = false) {
    this.ref.close(refresh);
  }

  regionChange = (event) => {
    if(this.isNewAddEntry){
    this.userId=null;
    }
    this.regionId=(event)?event.store_id?event.store_id:event.region_id:null;   
    if(event?.default_timezone){
      let timezone=this.timezoneMapping.filter((x) => x.value === event?.default_timezone);
      this.isEditMode ? '' : this.AddTimesheetEntry.controls.timezone.setValue(timezone[0].key ?timezone[0].key  : null);
    }
    
  }
  onSelectedUser=(event)=>{
    this.userId=(event)?event.id:null;
  }

}

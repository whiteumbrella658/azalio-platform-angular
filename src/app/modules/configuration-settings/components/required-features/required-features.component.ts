import { Component, OnInit, ViewChild} from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { AuthService } from 'src/app/core/services/auth.service';
import {ConfigurationSettingsService} from '../../configuration-settings.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-required-features',
  templateUrl: './required-features.component.html',
  styleUrls: ['./required-features.component.scss']
})
export class RequiredFeaturesComponent implements OnInit {
  @ViewChild('ngForm') ngForm: NgForm;
  requiredFeatureForm: FormGroup;
  is_scheduler:Boolean=false;
  is_scheduler_notification: Boolean=false;
  is_timeoff: boolean = false;
  is_communication:Boolean=false;
  loading:boolean;
  loadingSpinner:boolean;
  disable:boolean;
  showInput:boolean;
  check:number;
  dataSource:any;
  haschange:boolean;
  initialNotificationTime:number;
  isBoringPlay: boolean;
  constructor(
    private fb: FormBuilder,
    private gs: GeneralService,
    private service: ConfigurationSettingsService,
    private dataService: DataSharedService,
    private authService: AuthService 
  ) { 
    this.dataService.getConfigurations(false).then(config=> {
      this.isBoringPlay = config.company?.boring2Fun === 1 ? true : false;
    });
  }

  ngOnInit(): void {
    this.gs.hideSplashScreen();
    this.disable=true;
    this.check=0;
    this.showInput=false;
    this.dataSource=[];
    this.getDataSource();
    this.setFormValues();   
  }
  getDataSource(){
        this.loading = true;
        this.service.getRequiredFeatures()
        .then((response: any)=>{
          this.dataSource=response;
          this.dataSource.scheduling_notification_time=this.dataSource.scheduling_notification_time;
          this.requiredFeatureForm.patchValue(response);
          this.groupFormValueChange();
          if(this.dataSource.is_scheduler===1){
            this.is_scheduler=true;
          }
          if(this.dataSource.is_scheduler_notification===1 ){
            this.is_scheduler_notification=true;
          }
          if (this.dataSource.is_timeoff ===1) {
            this.is_timeoff = true;
          }
          if(this.dataSource.is_communication===1){
            this.is_communication=true;
          }
          this.initialNotificationTime=this.dataSource.scheduling_notification_time?this.dataSource.scheduling_notification_time:10;
          this.showInput=true;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.loading = false;
        });
  }
  setFormValues(){
      this.requiredFeatureForm = this.fb.group({
      is_location:0,
      is_camera:1,
      is_scheduler:1,
      is_scheduler_notification:1,
      is_timeoff: 1,
      is_swap_shift: 0,
      is_swap_shift_sms: 0,
      swap_is_manager_approval: 0,
      scheduling_notification_time: 10, //(this.is_scheduler_notification)?[10, [Validators.required ,Validators.maxLength(2), Validators.pattern("^[0-9]*$")]]:10,
      is_communication:0,
      is_chat_notification:0,
      is_read_receipt:0,
      is_tasks:0,
      is_rewards: 0,
      landing_module: 1
    });
this.updateValidations();
  }
  updateValidations=()=> {
    if(this.requiredFeatureForm.get('is_scheduler').value && this.requiredFeatureForm.get('is_scheduler_notification').value){

      this.requiredFeatureForm.controls.scheduling_notification_time.setValidators([Validators.required , Validators.maxLength(2), Validators.pattern("^[0-9]*$")]);
      this.requiredFeatureForm.controls.scheduling_notification_time.updateValueAndValidity();
    }else{
      this.requiredFeatureForm.controls.scheduling_notification_time.setValidators([]);
     this.requiredFeatureForm.controls.scheduling_notification_time.updateValueAndValidity();
    }
    }
  groupFormValueChange(){
    const initialValues=this.requiredFeatureForm.value;
    this.requiredFeatureForm.valueChanges.subscribe(value=>{
      this.haschange=Object.keys(initialValues).some(key=>
        {
          
          
          let newValue;
          if (typeof this.ngForm.value[key] == "boolean"){
            newValue=this.ngForm.value[key]? 1 : 0;
          }else{
            newValue=this.ngForm.value[key]
          }
          if(parseInt(newValue) !==initialValues[key]){
            return true;
          }

          
          return false;
        });
       // this.updateValidations();
        this.disable=this.haschange?false:true;
    });
  }
  submit = (ngForm) => {
    if (ngForm.valid) {
      this.loadingSpinner=true;
     this.saveRequiredFeatures(ngForm);
    }
  };
  saveRequiredFeatures= async (ngForm)=>{
    let firebase_auth_token='';
    let isScheduler=this.requiredFeatureForm.get('is_scheduler').value? 1 : 0;
    let is_scheduler_notification=(isScheduler==1)?this.requiredFeatureForm.get('is_scheduler_notification').value? 1 : 0 :0;
    let is_timeoff = (isScheduler == 1 ) ? this.requiredFeatureForm.get('is_timeoff').value? 1 : 0 : 0;
    let notificationTime=(is_scheduler_notification==1)?this.requiredFeatureForm.get('scheduling_notification_time').value:this.initialNotificationTime;
    const data={
      is_location:this.requiredFeatureForm.get('is_location').value? 1 : 0,
      is_camera:this.requiredFeatureForm.get('is_camera').value?1:0,
      is_scheduler:this.requiredFeatureForm.get('is_scheduler').value? 1 : 0,
      is_scheduler_notification:is_scheduler_notification,
      is_timeoff: is_timeoff,
      is_swap_shift: this.requiredFeatureForm.get('is_swap_shift').value ? 1 : 0,
      is_swap_shift_sms: this.requiredFeatureForm.get('is_swap_shift_sms').value ? 1 : 0,
      swap_is_manager_approval: this.requiredFeatureForm.get('swap_is_manager_approval').value ? 1 : 0,
      scheduling_notification_time: notificationTime,
      is_communication:this.requiredFeatureForm.get('is_communication').value? 1 : 0,
      is_chat_notification:this.requiredFeatureForm.get('is_chat_notification').value? 1 : 0,
      is_read_receipt: this.requiredFeatureForm.get('is_read_receipt').value? 1 : 0,
      is_tasks:this.requiredFeatureForm.get('is_tasks').value?1:0,
      is_rewards: this.requiredFeatureForm.get('is_rewards').value ? 1 : 0,
      landing_module: this.requiredFeatureForm.get('landing_module').value
    };
    try {
      const response: any = await this.service.updateRequiredFeatures(data);  
      this.showInput=false;
      this.getDataSource();
      this.setFormValues(); 
      this.disable=true;
      this.dataService.setConfigurations(null, false);
      firebase_auth_token=response?.firebase_token;
      this.gs.showToastSuccess(response?.message);
      
    
   // }
    } catch (error) {
      console.log(error);
      this.gs.showToastError(error?.message);
    } finally {
      this.loadingSpinner = false;
      if (firebase_auth_token) {
        await this.authService.setFirebaseToken(
         firebase_auth_token,  
       ); 
     }

     setTimeout(() => {
       window.location.reload();
     }, 100);
    }
  }
  onChange(element){

    if(element.localeCompare('is_scheduler')===0){
      this.is_scheduler=this.requiredFeatureForm.get(element).value;
      // if(this.is_scheduler===false){
      //   this.is_scheduler_notification=false;
    //     this.updateValidations();
      // }
    } else if(element.localeCompare('is_scheduler_notification')===0){
      this.is_scheduler_notification=this.requiredFeatureForm.get(element).value;
      this.updateValidations();
    }else if(element.localeCompare('is_communication')===0){
      this.is_communication=this.requiredFeatureForm.get(element).value;
    }
}

get landing() {
  return this.requiredFeatureForm?.controls?.landing_module?.value;
}
get form() {
  return this.requiredFeatureForm?.controls;
}

resetDefault(value, moduleId) {
  if (!value && this.landing == moduleId ) { //module turned off & matches the landing module
    this.setDefaultModule(1);//timesheet
  }
}
setDefaultModule(value) {
  this.requiredFeatureForm.controls.landing_module.setValue(value);
}

canDeactivate(): Observable<boolean> | boolean {
  return this.disable?false:true;
	}
}
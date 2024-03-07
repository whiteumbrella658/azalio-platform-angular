import { Component, OnInit, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormArray, NgForm } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { ConfigurationSettingsService } from '../../configuration-settings.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { Observable } from 'rxjs';
import { NbDialogService } from '@nebular/theme';
import { ConfirmModalComponent} from 'src/app/shared/components/confirm-modal/confirm-modal.component';
@Component({
  selector: 'app-roles-permissions-table',
  templateUrl: './roles-permissions.component.html',
  styleUrls: ['./roles-permissions.component.scss']
})
export class RolesPermissionsComponent implements OnInit {
  @ViewChild('ngForm') ngForm: NgForm;
  displayedColumns: any[]= ['role_title','Timesheet','Schedules','Tasks','Rewards', 'Organisation', 'Settings', 'Mobile'];
  modules: any = [
    { id: 0, key: 'role_title', heading: 'Role(s)', isVisible: 1, },
    { id: 1, key: 'Timesheet', heading: 'Timesheets', isVisible: 1, },
    { id: 2, key: 'Schedules', heading: 'Scheduler', isVisible: 1, configKey: 'is_scheduler' },
    { id: 3, key: 'Tasks', heading: 'Tasks', isVisible: 1, configKey: 'is_tasks' },
    { id: 4, key: 'Rewards', heading: 'Recognition', isVisible: 1, configKey: 'is_rewards' },
    { id: 5, key: 'Organisation', heading: 'Organisation', isVisible: 1, },
    { id: 6, key: 'Settings', heading: 'Settings', isVisible: 1, },
    { id: 7, key: 'Mobile', heading: 'Mobile App', isVisible: 1, },
    { id: 8, key: 'AzalioPlayUser', heading: 'User', isVisible: 1, },
    { id: 9, key: 'AzalioPlayAdmin', heading: 'Admin', isVisible: 1, },
  ];
  dataSource:any;
  dataSourceCopy: any|[];
  clickedRows = new Set<PeriodicElement>();
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild("myinput") myinput;
  loading: boolean;
  editRowId: number;
  check:boolean=true;
  disable:boolean;
  editIds;
  addConfigurations: FormGroup;
  showInput:boolean;
  isNewRow:boolean;
  loadingSpinner:boolean;
  currentRoleId: number;
  is_scheduler: any;
  count:number;
  mobileAccess;
  webAccess;
  initialFormValues:any;
  noAccess:boolean=false;
  rowNumber:number=-1;
  is_tasks:any;
  is_rewards:any;
  rowIndexArr=[];
  roleTableWidth;
  roleTiltleColWidth;
  mobileColWidth;
  webAccessHeaderWidth;
  isAzalioPlay: boolean;
  playWidth: number = 0;
  constructor(
    private service: ConfigurationSettingsService,
		private gs: GeneralService,
    private fb: FormBuilder,
    private dataService: DataSharedService,
    private dialogService: NbDialogService 
  ) { }

  ngOnInit(): void {
   // this.currentRoleId = this.dataService.getRoleId();
   // alert(this.currentRoleId);
    this.editIds=[];
    this.mobileAccess=[];
    this.webAccess=[];
    this.rowIndexArr=[];
    this.editRowId=-1;
    this.disable=true;
    this.showInput=false;
    this.dataSource=[];
    this.getDataSource();
    this.setForm();
    this.isNewRow=false;
    this.dataService
    .getConfigurations(false)
    .then((config) => {
      // console.log('config::: ', config);
      this.isAzalioPlay = config?.company.is_azalio_play == 1 ? true : false;
      if (this.isAzalioPlay) {
        this.displayedColumns.push('AzalioPlayUser');
        this.displayedColumns.push('AzalioPlayAdmin');
      }
      let companyConfig = config?.company;
      this.modules.forEach(module => {
        module.configKey ? module.isVisible = companyConfig[module.configKey] : ''
      });
      // this.is_scheduler = config.company?.is_scheduler;
      // this.is_tasks = config.company?.is_tasks;
      this.is_rewards = config.company?.is_rewards;
      this.currentRoleId=config?.role?.role_id
    })
    .finally(() => {});
  }
  setForm(){
    this.addConfigurations=this.fb.group({
      permissions: this.fb.array([])
    });
  }
  getDataSource(){
    this.loading = true;
    this.service.getRolesPermissionData()
    .then((response: any)=>{
      this.dataSource=response;
      this.count=this.dataSource.length;
      this.dataSourceCopy=JSON.parse(JSON.stringify(this.dataSource));
      // console.log('dataSourceCopy:: ', this.dataSourceCopy);
      this.dataSource?.forEach((config)=>{
        this.configurations.push(this.setRolesFormArray(config));
      });
      // console.log('configurations::: ', this.configurations);
      this.initialFormValues=this.configurations.value;
      this.groupFormValueChange();
      this.showInput=true;

    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      setTimeout(() => {  
        this.roleTableWidth = (document.getElementsByClassName("roles-table").item(0) as HTMLElement)?.offsetWidth;
        this.roleTiltleColWidth = (document.getElementsByClassName("role_title").item(0) as HTMLElement)?.offsetWidth;
        this.mobileColWidth = (document.getElementsByClassName("Mobile").item(0) as HTMLElement)?.offsetWidth + 2.0;
        if (this.isAzalioPlay) {
          this.playWidth =
           (document.getElementsByClassName("AzalioPlayUser").item(0) as HTMLElement)?.offsetWidth +
           (document.getElementsByClassName("AzalioPlayAdmin").item(0) as HTMLElement)?.offsetWidth ;
        }
        this.webAccessHeaderWidth = this.roleTableWidth - (this.roleTiltleColWidth + (this.mobileColWidth + this.playWidth))
      this.loading = false;
      }, 5);
    });
  }

  private setRolesFormArray(config){
    // console.log('config in setRolesFormArray::: ', config);
    let obj = {
      role_id: config.role_id,
      role_title: [config.role_title,[Validators.required, Validators.maxLength(30), RxwebValidators.unique()]], //config.title,
      Organisation: config.Organisation,
      Schedules: config.Schedules,
      Timesheet: config.Timesheet,
      Settings: config.Settings,
      Mobile: config.Mobile,
      Rewards: config.Rewards,
      Tasks:config.Tasks,
      AzalioPlayUser: config.AzalioPlayUser,
      AzalioPlayAdmin: config.AzalioPlayAdmin,
      send_sms: false,
      send_email:false,
    }
    // if (this.isAzalioPlay) {
    //   Object.assign(obj, {AzalioPlayUser: config.AzalioPlayUser,
    //     AzalioPlayAdmin: config.AzalioPlayAdmin,
    //   })
    // }
    return this.fb.group(obj);
  }

  get configurations() {
    return this.addConfigurations["controls"].permissions as FormArray;
  }
  groupFormValueChange(){
    const initialValues=this.configurations.value;
    this.configurations.valueChanges.subscribe(value=>{

      Object.keys(value).some(index=>
        {
          if((value[index].role_id && (initialValues[index].Organisation !==value[index].Organisation || initialValues[index].Schedules !==value[index].Schedules || initialValues[index].Timesheet !==value[index].Timesheet ||initialValues[index].Tasks !== value[index].Tasks || initialValues[index].Rewards !== value[index].Rewards || initialValues[index].Settings !== value[index].Settings || initialValues[index].Mobile !== value[index].Mobile
            || initialValues[index].AzalioPlayUser !== value[index].AzalioPlayUser || initialValues[index].AzalioPlayAdmin !== value[index].AzalioPlayAdmin))
          ||(!value[index].role_id) ){
            // console.log('IF');
            // console.log(value[index].Organisation);console.log(value[index].Schedules);
            // console.log(value[index].Timesheet);console.log(value[index].Tasks);
            // console.log(value[index].Settings);console.log(value[index].Mobile);
            // console.log(value[index].Rewards);
            if(value[index].Organisation== false && value[index].Schedules==false && value[index].Timesheet==false 
              && value[index].Tasks==false && (!this.is_rewards || value[index].Rewards == false) && value[index].Settings==false && value[index].Mobile==false
              && (!this.isAzalioPlay || (this.isAzalioPlay && value[index].AzalioPlayUser == false && value[index].AzalioPlayAdmin == false))
              ) {
                // console.log(value[index].AzalioPlayUser);
                // console.log(value[index].AzalioPlayAdmin);
                  if (this.rowIndexArr.find(x=>x===index) !== index) {
                    this.rowIndexArr.push(parseInt(index));
                    this.rowIndexArr = [...new Set(this.rowIndexArr)];
                   }
                this.rowNumber = parseInt(index);
                // console.log(this.rowIndexArr);
                // console.log(this.rowNumber);
            }
            else{
              if(this.rowIndexArr.length>0){
                const i = this.rowIndexArr.indexOf(parseInt(index));
                  if (i > -1) {
                    this.rowIndexArr.splice(i, 1); 
                  }
                  this.rowNumber=(this.rowIndexArr.length>0)?this.rowIndexArr[this.rowIndexArr.length-1]:-1;
                  // console.log(this.rowIndexArr);
                  // console.log(this.rowNumber);
                }
              }
          }else{
            if(this.rowNumber=== parseInt(index)){
              if(this.rowIndexArr.length>0){
                const i = this.rowIndexArr.indexOf(parseInt(index));
                  if (i > -1) {
                    this.rowIndexArr.splice(i, 1); 
                  }
                  this.rowNumber=(this.rowIndexArr.length>0)?this.rowIndexArr[this.rowIndexArr.length-1]:-1;
                  // console.log(this.rowIndexArr);
                  // console.log(this.rowNumber);
                }
            }
          }
          this.noAccess=(this.rowIndexArr.length>0)?true:false;
          
          if((value[index].role_id && initialValues[index].Mobile !== value[index].Mobile && value[index].Mobile)){
             if(this.mobileAccess.find(x=>x===index) !== index){
                this.mobileAccess.push(index);
                value[index].send_sms=true;
                        }
          }else {
            if(value[index].Mobile ==false){
            if(this.mobileAccess.length>0){
              const i = this.mobileAccess.indexOf(index);
                if (i > -1) {
                  this.mobileAccess.splice(i, 1); 
                  value[index].send_sms=false;
                }
              }
            }
         }
     
        if(value[index].role_id && (initialValues[index].Organisation !==value[index].Organisation || initialValues[index].Schedules !==value[index].Schedules 
          || initialValues[index].Timesheet !==value[index].Timesheet|| initialValues[index].Tasks !==value[index].Tasks || initialValues[index].Rewards !==value[index].Rewards)
          && !(initialValues[index].Organisation== true || initialValues[index].Schedules==true || initialValues[index].Timesheet==true || initialValues[index].Tasks==true || initialValues[index].Rewards==true || initialValues[index].Settings==true)
          &&((value[index].Organisation== true && initialValues[index].Schedules==false && initialValues[index].Timesheet==false && initialValues[index].Tasks==false && initialValues[index].Rewards==false && initialValues[index].Settings==false)
          ||(initialValues[index].Organisation== false && value[index].Schedules==true && initialValues[index].Timesheet==false && initialValues[index].Tasks==false && initialValues[index].Rewards==false && initialValues[index].Settings==false)
          ||(initialValues[index].Organisation== false && initialValues[index].Schedules==false && value[index].Timesheet==true && initialValues[index].Tasks==false && initialValues[index].Rewards==false && initialValues[index].Settings==false)
          ||(initialValues[index].Organisation== false && initialValues[index].Schedules==false && initialValues[index].Timesheet==false && value[index].Tasks==true && initialValues[index].Settings==false)
          ||(initialValues[index].Organisation== false && initialValues[index].Schedules==false && initialValues[index].Timesheet==false && initialValues[index].Tasks==false && value[index].Rewards==true && initialValues[index].Settings==false)
          ||(initialValues[index].Organisation== false && initialValues[index].Schedules==false && initialValues[index].Timesheet==false && initialValues[index].Tasks==false && initialValues[index].Rewards==false  && value[index].Settings==true)
          )){
            if(this.webAccess.find(x=>x===index) !== index){
              this.webAccess.push(index);
                      }
           value[index].send_email=true;
         }
         else{
          if(value[index].Organisation== false && value[index].Schedules==false && value[index].Timesheet==false && value[index].Tasks==false && value[index].Rewards==false && value[index].Settings==false){
            if(this.webAccess.length>0){
              const i = this.webAccess.indexOf(index);
                if (i > -1) {
                  this.webAccess.splice(i, 1); 
                }
              }
              value[index].send_email=false;
          }
         }
          if(this.dataSource[index]){
          this.dataSource[index].role_title=value[index].role_title;
          }
          if(value[index].role_id === null && value[index].role_title === '' ){
            this.addConfigurations.value.permissions.splice(index, 1);
          } else{

          if(JSON.stringify(value[index]) !==JSON.stringify(initialValues[index])){
           if(this.editIds.find(x=>x===index) !== index){
          this.editIds.push(index);
                  }
          }
          else{
         if(this.editIds.length>0){
                const i = this.editIds.indexOf(index);
                  if (i > -1) {
                    this.editIds.splice(i, 1); 
                  }
                }
          }
        }
          this.disable=(this.editIds.length>0)?false:true;    
        });    
    });
  }

submit(ngForm){
let result:false;
  if (ngForm.valid) {
    if(this.webAccess.length>0||this.mobileAccess.length>0){
     const dialogRef =this.dialogService.open(
      ConfirmModalComponent,{
        hasBackdrop: true, closeOnBackdropClick: false, 
        context: {heading: 'Are you sure?', 
        subHeading: 'You have updated access settings of one or more roles. Users with new access will receive invitation links via email/text message.'}
  }).onClose.subscribe(isActionConfirmed => {
if(isActionConfirmed==true){
  this.loadingSpinner=true;
  this.saveData(ngForm);
  this.webAccess=[];
  this.mobileAccess=[];
} 
  });

}else{
    this.loadingSpinner=true;
    this.saveData(ngForm);
}
  }
  else{
    console.log("error")
  }
}

saveData= async (ngForm)=>{
  // this.addConfigurations.value.permissions.shift();
  // this.initialFormValues.shift();
const updatedData=[]; 
this.addConfigurations.value.permissions.forEach((config,index)=>{
  if(config.role_title !==''){
if(JSON.stringify(config) !== JSON.stringify(this.initialFormValues[index]) ){
  const data = { 
    role_id: config.role_id,
    role_title: config.role_title, 
    OrganisationManagement: config.Organisation,
    Schedules: config.Schedules,
    TimesheetManagement: config.Timesheet,
    Settings: config.Settings,
    Mobile: config.Mobile,
    send_sms:config.send_sms,
    send_email:config.send_email,
    Tasks:config.Tasks,
    Rewards:config.Rewards,
  }
  if (this.isAzalioPlay) {
    Object.assign(data, { AzalioPlayUser: config.AzalioPlayUser,
      AzalioPlayAdmin: config.AzalioPlayAdmin})
  }
  updatedData.push(data);
}
  
}
});

const arrData=[];
arrData.push({"permissions": updatedData});
try {
  const response: any = await this.service.updateRolesAndResponsibilities(arrData[0])
  this.gs.showToastSuccess(response?.message);
  this.showInput=false;
  this.editIds=[];
  this.dataSource=[];
  this.getDataSource();
  this.setForm();
  this.dataService.setConfigurations(null, false);
  this.disable=true;
} catch (error) {
  this.gs.showToastError(error.message);
} finally {
  this.isNewRow=false;
  this.loadingSpinner=false;
}
}

addRow(){
  const newData={role_id:null, role_title: null, Organisation: true, Schedules: true, Timesheet: true, Settings: false, Mobile: true, Tasks:true, Rewards: true, AzalioPlayUser: false, AzalioPlayAdmin: false};
  this.dataSource.push(newData);
    const row = this.fb.group({
      role_id: null,
			role_title: ['',[ Validators.maxLength(30), RxwebValidators.unique()]],
			Organisation: true,
			Schedules: true,
			Timesheet: true,
			Settings: false,
			Mobile: true,
      send_sms:false,
      send_email:false,
      Tasks:true,
      Rewards: true,
      AzalioPlayUser: false,
      AzalioPlayAdmin: false
    });
    this.configurations.push(row);
    this.table.renderRows();
    setTimeout(() => {
      this.myinput.nativeElement.focus();
    });
    this.editRowId = this.dataSource.length-1;
    this.isNewRow=true;
  }
  editTitle(index) {
    this.gs.logEvents('edit_role')
    this.editRowId = index;
    setTimeout(() => {
      this.myinput.nativeElement.focus();
    });
   
  }

  onFocusOut(index){
 
    let title=this.addConfigurations.value.permissions[index].role_title;
    let id=this.addConfigurations.value.permissions[index].role_id;
    if(title ===''&& id===null){
      this.configurations.removeAt(index);
      this.dataSource.splice(index,1);
      this.removeId(index);
    }else if(this.addConfigurations.invalid){
      return false;
    }
    this.editRowId=-1;
    this.table.renderRows();
  }
  
  editRowColor(index, role_id){
    if(role_id===null){
      return true;
    }
   const i = this.editIds.indexOf(index.toString());
   return (i > -1);
   
  }

  deleteRow(rowIndex){
    this.configurations.removeAt(rowIndex);
    this.dataSource.splice(rowIndex, 1);
    this.table.renderRows();
    this.removeId(rowIndex);
  }
  removeId(index){
    if(this.editIds.length>0){
      const i = this.editIds.indexOf(index.toString());
      if (i > -1) {
        this.editIds.splice(i, 1); 
      }
      }
      this.disable=(this.editIds.length>0)?false:true;
     
  }
  keytab(event){
   event.preventDefault();
    this.editRowId=-1;
    this.table.renderRows();
  }

  canDeactivate(): Observable<boolean> | boolean {
    return this.disable?false:true;
    }
    }

export interface PeriodicElement {
  role_id: Number,
	role_title: string,
	Organisation: boolean,
  Schedules:boolean,
	Assignment: boolean,
	Timesheet: boolean,
	Settings: boolean,
	Mobile: boolean,
  Tasks:boolean,
  Rewards: boolean,
}
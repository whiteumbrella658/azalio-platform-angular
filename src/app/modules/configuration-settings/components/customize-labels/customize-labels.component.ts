import { Component, OnInit,ViewChild,OnChanges, SimpleChanges } from '@angular/core';
import { NgForm, FormGroup, FormBuilder,Validators } from '@angular/forms';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { GeneralService } from 'src/app/core/services/general.service';
import {ConfigurationSettingsService} from '../../configuration-settings.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-customize-labels',
  templateUrl: './customize-labels.component.html',
  styleUrls: ['./customize-labels.component.scss']
})
export class CustomizeLabelsComponent implements OnInit {
  @ViewChild('ngForm') ngForm: NgForm;
  customizeLabelsForm: FormGroup;
  loading: Boolean;
  loadingSpinner:boolean;
  dataSource:any;
  disable:boolean;
  showInput:boolean;
  haschange:boolean;
  constructor(   
     private fb: FormBuilder,
     private gs: GeneralService,
     private service: ConfigurationSettingsService,
     private dataService: DataSharedService
    ) { }

  ngOnInit(): void {
    this.disable=true;
    this.showInput=false;
    this.gs.hideSplashScreen();
    this.dataSource=[];
    this.getDataSource();
    this.setForm();
   // this.groupFormValueChange();
    
   
  }
groupFormValueChange(){
  const initialValues=this.customizeLabelsForm.value;
  this.customizeLabelsForm.valueChanges.subscribe(value=>{
    this.haschange=Object.keys(initialValues).some(key=>(this.ngForm.value[key] !==initialValues[key]));
    this.disable=this.haschange?false:true;   
  });
}
  getDataSource(){
    this.loading = true;
    this.service.getCustomizedLabels()
    .then((response: any)=>{
      this.dataSource=response;
      this.customizeLabelsForm.patchValue(response);
      this.groupFormValueChange();
      this.showInput=true;
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      this.loading = false;
    });

  }
  setForm(){
    this.customizeLabelsForm = this.fb.group({
      job_custom_name: ['Assignment', [Validators.required, Validators.maxLength(20)]],
      region_custom_name:['Store', [Validators.required, Validators.maxLength(20)]],
      team_custom_name:['Team', [Validators.required, Validators.maxLength(20)]],
    });
  }

  submit = (ngForm) => {
    if (ngForm.valid) {
      this.loadingSpinner = true;
     this.saveCustomizeLabels(ngForm);
    }
  };

  saveCustomizeLabels= async (ngForm)=>{
    const data={
      job_custom_name: this.customizeLabelsForm.get('job_custom_name').value,
      region_custom_name:this.customizeLabelsForm.get('region_custom_name').value,
      team_custom_name: this.customizeLabelsForm.get('team_custom_name').value,
    };
    try {
      const response: any = await this.service.updateCustomizeLabels(data);
      this.gs.showToastSuccess(response?.message);
      this.showInput=false;
      this.getDataSource();
      this.setForm();
      this.disable=true;
      this.dataService.setConfigurations(null, false);
    } catch (error) {
      this.gs.showToastError(error.message);
    } finally {
      this.loadingSpinner = false;
    }
  }
  canDeactivate(): Observable<boolean> | boolean {
    return this.disable?false:true;
    }
}

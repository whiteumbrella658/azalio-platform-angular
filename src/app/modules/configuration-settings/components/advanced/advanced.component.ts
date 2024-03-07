import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
} from '@angular/cdk/drag-drop';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ConfigurationSettingsService } from '../../configuration-settings.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { fstat } from 'fs';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-advanced',
  templateUrl: './advanced.component.html',
  styleUrls: ['./advanced.component.scss'],
})
export class AdvancedComponent implements OnInit {
  @ViewChild('ngForm') ngForm: NgForm;
  @ViewChild(CdkDrag) CdkDrag: CdkDrag;
  @ViewChild(CdkDropList) CdkDropList: CdkDropList;
  // @ViewChild(CdkDropListGroup) CdkDropListGroup: CdkDropListGroup<any>([]);;
  stores = [];

  // stores = [{ id: 1, name: '501 Starbucks' }, { id: 2, name: '501 Subway' }, { id: 3, name: '248 Wendy\'s' }, { id: 4, name: '249 Subway' }];

  data: any;
  groups: any;
  advancedForm: FormGroup;
  loadingSpinner: boolean;
  loading: boolean;
  haschange: boolean;
  hasChangeGroups: boolean;
  noChangeGroups: boolean;
  disableDueToEmptyGroups: boolean;

  drop(event: CdkDragDrop<string[]>) {
    this.gs.logEvents('custom_group_dragged_and_dropped')
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    this.isEquals(); //check if grouping has changed
  }

  disable: boolean;

  constructor(
    private router: Router,
    private dataService: DataSharedService,
    private gs: GeneralService,
    private fb: FormBuilder, 
    private service: ConfigurationSettingsService
    ) { 
    this.dataService
      .getConfigurations(false)
      .then((config) => {
        if (!config.company.is_scheduler) {
          this.router.navigate(['401']);
        }
      })
      .finally(() => {
      });
  }

  ngOnInit(): void {
    this.disable = true;
    this.noChangeGroups = true;
    this.getData();
  }

  isEquals() {
    setTimeout(() => {
      let arr = this.groups.filter(g=> g.stores.length == 0);
      this.disableDueToEmptyGroups = this.data.groups?.length == 0 && this.groups?.length == arr.length ? true : false;
      console.log(this.disableDueToEmptyGroups);
      if (JSON.stringify(this.groups) === JSON.stringify(this.data.groups)) {
        this.noChangeGroups = true;
      } else {
        this.noChangeGroups = false;
      }
    });
  }

  groupFormValueChange() {
    const initialValues = this.advancedForm.value;
    this.advancedForm.valueChanges.subscribe(value => {
      this.haschange = Object.keys(initialValues).some(key => {
        let newValue;
        if (typeof this.ngForm.value[key] == "boolean") {
          newValue = this.ngForm.value[key] ? 1 : 0;
        } else {
          newValue = this.ngForm.value[key]
        }
        if (parseInt(newValue) !== initialValues[key]) {
          return true;
        }
        return false;
      });
      this.disable = this.haschange ? false : true;
    });
  }

  // groupFormValueChange() {
  //   const initialValues = this.advancedForm.value;
  //   this.advancedForm.valueChanges.subscribe(value => {
  //     this.haschange = Object.keys(initialValues).some(key => (this.ngForm.value[key] !== initialValues[key]));
  //     this.disable = this.haschange ? false : true;
  //   });
  // }

  getData() {
    this.loading = true;
    this.service.getAdvanced().then((response: any)=>{
      this.data = response;
      // this.dataSource=response;
      // this.customizeLabelsForm.patchValue(response);
      // this.groupFormValueChange();
      // this.showInput=true;
      this.stores = this.data.stores_without_groups;
      this.groups = JSON.parse(JSON.stringify(this.data.groups));
      if (this.groups?.length == 0) {
        this.data['custom_groups'] = 0;
      } else {
        this.data['custom_groups'] = 1;
      }
      this.setForm();
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      this.loading = false;
    });
  }

  onCustomGroup() {
    let isCustomGroup = this.advancedForm.controls.custom_groups.value;
    this.groups = JSON.parse(JSON.stringify(this.data.groups));
    if (this.groups?.length == 0 && isCustomGroup == 1) {
      this.addGroup();
    } else if (isCustomGroup == 0) {
      this.groups = [];
    }
    this.isEquals(); //check if grouping has changed
  }

  setForm() {
    this.advancedForm = this.fb.group({
      is_open_shift: [this.data.is_open_shift, []],
      max_weekly_hours: [this.data.max_weekly_hours, [Validators.required, Validators.maxLength(2)]],
      is_open_shift_sms: [this.data.is_open_shift_sms, []],
      open_is_manager_approval: [this.data.open_is_manager_approval, []],
      block_open_shifts: [this.data.block_open_shifts],
      custom_groups: [this.data.custom_groups],
    });
    setTimeout(() => {
      if (this.advancedForm?.controls?.max_weekly_hours.value == null) {
        this.advancedForm.controls.max_weekly_hours.setValue(40);
      }
      this.groupFormValueChange();
    });
  }

  resetForm() {
    let isOpenShift = this.advancedForm.controls.is_open_shift.value;
    if (!isOpenShift && (isOpenShift == this.data.is_open_shift)) { //if same as before (OFF)
      this.disable = true;
      this.noChangeGroups = true;
      this.setForm();
      this.groups = [];
    }
  }

  addGroup() {
    let groupId = 'group' + this.groups.length;
    this.groups.push({groupId: groupId, stores: []});
    this.isEquals(); //check if grouping has changed
  }

  removeGroup(index) {
    this.stores = this.stores.concat(this.groups[index].stores);
    this.groups.splice(index, 1);
    this.isEquals(); //check if grouping has changed
  }

  submit(ngForm) {
    if (ngForm.valid) {
      let controls = this.advancedForm.controls;
      const data = {
        is_open_shift: controls.is_open_shift.value ? 1 : 0,
        max_weekly_hours: Number(controls.max_weekly_hours.value),
        is_open_shift_sms: controls.is_open_shift_sms.value ? 1 : 0,
        open_is_manager_approval: controls.open_is_manager_approval.value ? 1 : 0,
        block_open_shifts: controls.block_open_shifts.value ? 1 : 0,
        custom_groups: controls.custom_groups.value ? 1 : 0,
        groups: this.groups.map(g=> {return {groupId: g.groupId, stores: g.stores.map(x=> x.id) }})
      }
      this.saveData(data);
    }

  }

  async saveData(data) {
    this.loadingSpinner = true;
    try {
      const response: any = await this.service.updateAdvanced(data);
      this.gs.showToastSuccess(response?.message);
      // this.showInput=false;
      this.getData();
      // this.initForm();
      this.disable = true;
      this.noChangeGroups = true;   
    } catch (error) {
      this.gs.showToastError(error.message);
    } finally {
      this.loadingSpinner = false;
    }
  }

  canDeactivate(): Observable<boolean> | boolean {
    return this.disable && this.noChangeGroups ? false : true; // true -> open confirmation, false -> don't open
  }

}

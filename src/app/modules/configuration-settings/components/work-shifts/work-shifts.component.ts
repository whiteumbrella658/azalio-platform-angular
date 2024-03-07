import { Component, OnInit,ViewChild,Input,Output } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { GeneralService } from 'src/app/core/services/general.service';
import {ConfigurationSettingsService} from '../../configuration-settings.service';
import { Observable, timer } from 'rxjs';
import { taskTagColors, userTagColors } from 'src/constants';


@Component({
  selector: 'app-work-shifts',
  templateUrl: './work-shifts.component.html',
  styleUrls: ['./work-shifts.component.scss']
})
export class WorkShiftsComponent implements OnInit {
  @ViewChild('ngForm') ngForm: NgForm;
  WorkShiftsForm: FormGroup;
  loading: Boolean;
  loadingSpinner:boolean;
  disable:boolean;
  weekDaysData=WEEK_DAYS;
  exceptionOptions = exception_options;
  thirdShiftData=THIRD_SHIFT;
  dataSource:any; //=SOURCE_DATA;
  showInput:boolean;
  haschange:boolean;
  originalLeaveTypes: any;
  originalLabelTypes: any;
  displayPopup: boolean;
  userTagColors: string[];
  taskTagColors: string[];
  selectedColor: any;
  showColorPopup: boolean;
  selectedLabelRow: any;
  isOpenShift: boolean = false;
  originalTaskTags: any;
  constructor(
    private fb: FormBuilder,
    private gs: GeneralService,
    private service: ConfigurationSettingsService,
    private dataService: DataSharedService,      
  ) { 
    this.dataService.getConfigurations(false)
    .then((config) => {
      this.isOpenShift = config.company?.is_open_shift == 1 ? true : false;
      setTimeout(() => {
        this.setWeeklyMaxHourValidators();
      }, 20);
    })
  }

  ngOnInit(): void {
    this.userTagColors = userTagColors.slice();
    this.taskTagColors = taskTagColors.slice();
    this.gs.hideSplashScreen();
    this.disable=true;
    this.showInput=false;
    this.dataSource=[];
    this.loading= false;
    this.loadingSpinner = false;
    this.displayPopup = false;
    this.getDataSource();
    this.initForm();

  }

  setWeeklyMaxHourValidators() {
    let formControls = this.WorkShiftsForm.controls;
    if (this.isOpenShift) {
      formControls.max_weekly_hours.setValidators([Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(4)])
      formControls.max_weekly_hours.updateValueAndValidity();
    } else {
      formControls.max_weekly_hours.setValidators([Validators.pattern("^[0-9]*$"), Validators.maxLength(4)])
      formControls.max_weekly_hours.updateValueAndValidity();
    }
  }

  selectColor(index, isTags = false) {
    this.showColorPopup = false;
    this.selectedColor = isTags? this.taskTagColors[index] : this.userTagColors[index];
    this.selectedLabelRow.controls.color.setValue(this.selectedColor);
    this.selectedLabelRow.controls.color.markAsDirty();
  }

  selectRow(row) {
    this.selectedColor =  row.controls.color.value;
    this.showColorPopup = true;
    this.selectedLabelRow = row;
  }

  getDataSource(){
    this.loading = true;
    this.loadingSpinner = false;
    this.service.getRules()
    .then((response: any)=>{
      this.dataSource=response;
      this.originalTaskTags = this.dataSource.task_tags ? JSON.parse(JSON.stringify(this.dataSource.task_tags)) : [];
      this.originalLeaveTypes = this.dataSource.leave_types ? JSON.parse(JSON.stringify(this.dataSource.leave_types)) : [];
      this.originalLabelTypes = this.dataSource.user_label_types ? JSON.parse(JSON.stringify(this.dataSource.user_label_types)) : [];

      // this.WorkShiftsForm.patchValue(this.dataSource); //populating fields using setValue now
      let colors =   [...this.dataSource.task_tags.map(x=> x.color), ...this.taskTagColors];
      this.taskTagColors = [...new Set(colors)]
      this.populateFields();
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
  

  populateFields() {
    let formControls = this.WorkShiftsForm.controls
    formControls.week_start_day.setValue(this.dataSource.week_start_day);
    formControls.is_third_shift.setValue(this.dataSource.is_third_shift);
    formControls.max_daily_hours.setValue(this.dataSource.max_daily_hours);
    formControls.max_weekly_hours.setValue(this.dataSource.max_weekly_hours);
    // formControls.graveyard_exception.setValue(this.dataSource.graveyard_exception);
    this.dataSource.leave_types.forEach(leave => {
      this.leaveTypes.push(this.fb.group({
        id: [leave.id, [Validators.required, Validators.maxLength(128)]],
        type: [leave.type, [Validators.required, Validators.maxLength(128)]]
    }))
    });
    this.dataSource.task_tags.forEach(tag => {
      this.taskTags.push(this.fb.group({
        id: [tag.id, [Validators.required, Validators.maxLength(128)]],
        tag: [tag.tag, [Validators.required, Validators.maxLength(128)]],
        color: [tag.color]
      }))
    });
    this.dataSource.user_label_types.forEach(label => {
      this.labelTypes.push(this.fb.group({
        id: [label.id, [Validators.required, Validators.maxLength(128)]],
        tag: [label.tag, [Validators.required, Validators.maxLength(128)]],
        color: [label.color]
      }))
    });
  }

  initForm(){
    this.WorkShiftsForm = this.fb.group({
      week_start_day:[0, [Validators.required, Validators.maxLength(20)]],
       is_third_shift:[1, [Validators.required, Validators.maxLength(20)]],
       max_daily_hours: [null, [Validators.pattern("^[0-9]*$"), Validators.maxLength(4)]],
       max_weekly_hours:[null, [Validators.pattern("^[0-9]*$"), Validators.maxLength(4)]],
      //  graveyard_exception: [0, [Validators.required]],
      leave_types: new FormArray([
        // this.initLeave()
      ]),
      task_tags: new FormArray([
      ]),
      label_types: new FormArray([
        // this.initLeave()
      ])
     });
      this.setWeeklyMaxHourValidators();
  }

  initLeave() {
    return (this.fb.group({
      id: [null],
      type: ['', [Validators.required, Validators.maxLength(128)]],
      is_deleted: null
    }))
  }

  initLabel() {
    this.selectedColor = this.userTagColors[0];
    return (this.fb.group({
      id: [null],
      tag: ['', [Validators.required, Validators.maxLength(128)]],
      color: [this.userTagColors[0]], //set a default color here.
      is_deleted: null
    }))
  }

  addLeave() {
    const control = this.WorkShiftsForm.get('leave_types') as FormArray;
    control.insert(0, this.initLeave());
    this.scrollToTop('leavesWrapper');
  }
  removeLeave(i) {
    const control = this.WorkShiftsForm.get('leave_types') as FormArray;
    control.removeAt(i);
  }
  addTag() {
    const control = this.WorkShiftsForm.get('task_tags') as FormArray;
    control.insert(0, this.initLabel());
    this.scrollToTop('tagsWrapper');
  }
  scrollToTop(id) {
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollTop = 0;
    }
  }
  removeTag(i) {
    const control = this.WorkShiftsForm.get('task_tags') as FormArray;
    control.removeAt(i);
  }

  addLabel() {
    const control = this.WorkShiftsForm.get('label_types') as FormArray;
    control.insert(0, this.initLabel());
    this.scrollToTop('userWrapper');
  }
  removeLabel(i) {
    const control = this.WorkShiftsForm.get('label_types') as FormArray;
    control.removeAt(i);
  }

  get form() { return this.WorkShiftsForm.controls; }
  get leaveTypes() { return this.form.leave_types as FormArray; };
  get taskTags() { return this.form.task_tags as FormArray; };
  get labelTypes() { return this.form.label_types as FormArray; };

  groupFormValueChange(){
    const initialValues=this.WorkShiftsForm.value;
    this.WorkShiftsForm.valueChanges.subscribe(value=>{
      this.haschange=Object.keys(initialValues).some(key=>(parseInt(this.ngForm.value[key]) !==initialValues[key]));
        this.disable=this.haschange?false:true; 
    });
  }

  submit = (ngForm) => {
    if (ngForm.valid) {
      this.loadingSpinner=true;
      this.saveWorkShifts(ngForm);
    }
  };

  saveWorkShifts= async (ngForm)=>{
    const data={
      week_start_day: this.WorkShiftsForm.get('week_start_day').value,
      is_third_shift:this.WorkShiftsForm.get('is_third_shift').value,
      max_daily_hours: this.WorkShiftsForm.get('max_daily_hours').value,
      max_weekly_hours:this.WorkShiftsForm.get('max_weekly_hours').value,
      // graveyard_exception: this.WorkShiftsForm.get('graveyard_exception').value,
      leave_types: this.deletedAndUpdatedLeaveTypes(),
      user_label_types: this.deletedAndUpdatedLabelTypes(),
      task_tags: this.deletedAndUpdatedTaskTags(),
    }
    try {
      const response: any = await this.service.updateRules(data);
      this.gs.showToastSuccess(response?.message);
      this.showInput=false;
      this.getDataSource();
      this.initForm();
      this.disable=true;
      this.dataService.setConfigurations(null, false);
      
    } catch (error) {
      this.gs.showToastError(error.message);
    } finally {
      this.loadingSpinner = false;
    }
  }

  deletedAndUpdatedTaskTags() {
    let deletedTaskTags = this.originalTaskTags.filter(obj => {
      return !this.taskTags.value.some(obj2 => { return obj.id == obj2.id });
    });
    deletedTaskTags.forEach(type => {
      type.is_deleted = true;
    });
    let updatedTaskTags = this.taskTags.controls.filter((tag) => {
      if (tag.get('tag').dirty || tag.get('color').dirty) {
        return true
      } return false
    }).map((tag) => {
        return {
          id: tag.get('id').value,
          tag: tag.get('tag').value,
          color: tag.get('color').value,
          is_deleted: tag.get('id').value == null ? null : false
        }
      });
    return [...deletedTaskTags, ...updatedTaskTags]
  }

  deletedAndUpdatedLeaveTypes() {
    let deletedLeaveTypes = this.originalLeaveTypes.filter(obj => {
      return !this.leaveTypes.value.some(obj2 => { return obj.id == obj2.id });
    });
    deletedLeaveTypes.forEach(type => {
      type.is_deleted = true;
    });

    let updatedLeaveTypes = this.leaveTypes.controls.filter((leaveType) => {
      if (leaveType.get('type').dirty) {
        return true
      } return false
    })
      .map((leaveType) => {
        return {
          id: leaveType.get('id').value,
          type: leaveType.get('type').value,
          is_deleted: leaveType.get('id').value == null ? null : false
        }
      });
    return [...deletedLeaveTypes, ...updatedLeaveTypes]
  }
  
  deletedAndUpdatedLabelTypes() {
    let deletedLabelTypes = this.originalLabelTypes.filter(obj => {
      return !this.labelTypes.value.some(obj2 => { return obj.id == obj2.id });
    });
    deletedLabelTypes.forEach(type => {
      type.is_deleted = true;
    });

    let updatedLabelTypes = this.labelTypes.controls.filter((labelType) => {
      if (labelType.get('tag').dirty || labelType.get('color').dirty){
        return true
      } return false
    })
      .map((labelType) => {
        return {
          id: labelType.get('id').value,
          tag: labelType.get('tag').value,
          color: labelType.get('color').value,
          is_deleted: labelType.get('id').value == null ? null : false
        }
      });
    return [...deletedLabelTypes, ...updatedLabelTypes]
  }

  canDeactivate(): Observable<boolean> | boolean {
    return this.disable?false:true;
    }
}



const WEEK_DAYS=[
  { key:1, value:'Monday'},
  { key:2, value:'Tuesday'},
  { key:3, value:'Wednesday'},
  { key:4, value:'Thursday'},
  { key:5, value:'Friday'},
  { key:6, value:'Saturday'},
  { key:0, value:'Sunday'},
];

const exception_options = [
  { key:-1, value:'Remove schedule whose end date intersects with the leave'},
  { key:1, value:'Remove schedule whose start date intersects with the leave'},
  { key:2, value:'Remove both schedules'},
  { key:0, value:'Don\'t remove any schedule'},
];

const THIRD_SHIFT=[
  { key: 1, value:'Yes'},
  { key: 0, value:'No'}
]

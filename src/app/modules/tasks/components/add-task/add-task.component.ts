import { AfterViewChecked, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { TasksService } from '../../tasks.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit, AfterViewChecked {

  @Input() shifts;
  @Input() regionId;
  @Input() selectedData;
  @Input() tagsData;
  @Input() description;
  @Input() isEditMode;
  @Input() permissions;
  @Input() isAddEditTagsOnly;
  @Input() taskId;

  loading: boolean = false;
  buttonLabel: any;
  headerTitle: any;
  form: FormGroup;
  points: any[] = [
    { key: 0, value: '0 points' },
    { key: 10, value: '10 points' },
    { key: 20, value: '20 points' },
    { key: 50, value: '50 points' },
    { key: 100, value: '100 points' }
  ];
  repeatTypeData: any[] = [
    { key: 0, value: 'Everyday - Default' },
    { key: 1, value: 'Custom dates' },
    { key: 2, value: 'Custom days' },
  ];
  
  weekDays: any[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  isAllChecked: any;
  tags: any[];
  selectedTags: any;

  constructor(
    private dataService: DataSharedService,
    private service: TasksService,
    private gs: GeneralService,
    private fb: FormBuilder,
    private ref: NbDialogRef<AddTaskComponent>,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) { 
    this.dataService.getTaskTags(false).then((tags) => {
      this.tags = tags; 
    }).finally(() => {});	
  }

  get days() {
    return this.formc.daysArray as FormArray;
  }

  get dates() {
    return this.formc.datesArray as FormArray;
  }

  get formc() {
    return this.form.controls;
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  ngOnInit(): void {
    this.gs.logEvents('task_advanced_options_popup_opened')
    this.buttonLabel = this.isAddEditTagsOnly ? 'Save' : 'Ok';
    this.headerTitle = this.getHeaderTitle();
    if (this.selectedData || this.tagsData) {
      this.EditShiftFormValues();
    } else {
      this.initForm();
    }
  }

  getHeaderTitle() {
    if (this.isAddEditTagsOnly){
      return this.tagsData?.length > 0 ? 'Edit Task Tags' : 'Add Task Tags';
    } else {
      return this.isEditMode ? 'Edit Task Advanced' : 'Add Task Advanced';
    }
  }

  initForm() {
    this.shifts = this.shifts;
    this.form = this.fb.group({
      // id: [null],
      // taskName: ['', [Validators.required, Validators.maxLength(120)]],
      // shift: [null, [Validators.required]],
      // count: ['', [Validators.required]],
      // points: [this.points[1].key, [Validators.required]],
      // isAllStores: ['1'],
      datesArray: new FormArray([this.fb.group({
        value: [null],
        })
      ]), 
      daysArray: new FormArray([]),
      repeatType: [0, [Validators.required]],
      description: [''],
      tagName: []
    })

    this.weekDays.forEach(day=> {
      this.days.push(this.fb.group({
        name: [day],
        checked: [false],
      }))
    });
  }


  populateDates() {
    if (this.selectedData.dates == null) {
      this.dates.push(this.fb.group({
        value: [null],
        })
      )
      return;
    };
    this.selectedData.dates.forEach(date => {
      this.dates.push(
        this.fb.group({
          value: new Date(date),
        })
      );
    })
  }

  populateDays() {
    this.weekDays.forEach(dayName => {
      this.days.push(
        this.fb.group({
          name: [dayName],
          checked: [this.selectedData.days?.includes(dayName) ? true : false]
        })
      );
    })
  }

  showDetails(id) {
    return this.formc?.repeatType?.value == id ? true : false;
  }


  addDate() {
    if (this.dates.length > 11) {
      return;
    }
    this.dates.push(
      this.fb.group({
        value: [null],
      })
    );
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  }

  scrollToBottom() {
    const elem = document.getElementById('dates-wrapper');
    if (elem) {
      elem.scrollTop = elem.scrollHeight;
    }
  }


  EditShiftFormValues() {
    // this.isAllChecked = Boolean(this.selectedData.all_shifts);
    // let shiftsData = this.isAllChecked ? null : this.selectedData.shifts.map(shift => shift.id);
    this.form = this.fb.group({
      // id: [this.selectedData.id],
      // taskName: [this.selectedData.name, [Validators.required, Validators.maxLength(120)]],
      // shift: [shiftsData, [Validators.required]],
      // points: [this.selectedData.points, [Validators.required]],
      // isAllStores: [this.selectedData.all_store.toString()],
      description: [this.description],
      repeatType: [this.selectedData?.repeatType ? this.selectedData.repeatType : 0],
      datesArray: new FormArray([]),
      daysArray: new FormArray([]),
      tagName: [this.tagsData],
    });

      this.populateDates();
      this.populateDays();
    // this.setValidators(this.isAllChecked);
  }

  checkedChange(isChecked) {
    this.isAllChecked = isChecked;
    this.setValidators(isChecked);
  }

  setValidators(isChecked) {
    if (isChecked) {
      this.form.controls.shift.setValidators([]);
      this.form.controls.shift.disable();
      this.form.controls.shift.updateValueAndValidity();
    } else {
      this.form.controls.shift.setValidators([Validators.required]);
      this.form.controls.shift.enable();
      this.form.controls.shift.updateValueAndValidity();
    }
  }

  // onFocusOut() {
  //   const val = this.form.value.count;
  //   if (isNaN(val) || val < 1) {
  //     this.form.controls.count.setValue(1);
  //   }
  // }

  // deleteTask() {
  //   console.log('delete clicked');
  // }

  submit = (ngForm) => {
    // console.log(ngForm);
    if (ngForm.valid) {
      // if (this.selectedData) {
      //   this.editTask();
      // } else {
      //   this.addTask();
      // }
      this.close(true);
    }
  };

  addTask = async () => {
    let data = await this.createDataModal();
    try {
      this.loading = true;
      const response: any = await this.service.addNewTask(data);
      this.gs.showToastSuccess(response?.message);
      // setTimeout(() => {
        // this.close(true);
      // }, 200);
    } catch (error) {
      this.gs.showToastError(error.message);
      console.log(error)
    } finally {
      this.loading = false;
    }
  }

  editTask = async () => {
    let data = await this.createDataModal();
    try {
      this.loading = true;
      const response: any = await this.service.editTask(data);
      this.gs.showToastSuccess(response?.message);
      // setTimeout(() => {
        // this.close(true);
      // }, 200);
    } catch (error) {
      this.gs.showToastError(error.message);
      console.log(error)
    } finally {
      this.loading = false;
    }
  }

  getSelectedDates(i = null) {
    let result = this.dates.controls.map((x,index) => {
      if (x.value.value && index !== i) {
        // return this.gs.convertToLocalDateString(x.value.value)
        return x.value.value?.toISOString()
      };
    }).filter(x => x !== undefined)
    return result;
  }

  filter = (i) => (date) => {
    if (date == 'Invalid Date') {
      return true;
    } else if (this.getSelectedDates(i).some((d) => d === date.toISOString())) {
      return false;
    } else {
      return true;
    }
  }

  getSelectedDays() {
    let result = this.days.controls.filter(x => {
      if (x.value.checked) {
        return x.value.name
      }
    }).map(x => {
      return x.value.name;
    });
    return result;
  }

  removeRow(i) {
    this.dates.removeAt(i);
  }

  createDataModal() {
    // let shiftsData = []
    // this.form.get('shift').value?.forEach(shiftId => {
    //   let obj = { shift_id: shiftId, task_repeats: 1 }
    //   shiftsData.push(obj)
    // });
    let repeatsData = {
      repeatType: this.form.get('repeatType').value,
      dates: this.form.get('repeatType').value == 1 ? this.getSelectedDates() : null,
      days: this.form.get('repeatType').value == 2 ? this.getSelectedDays() : null
    }
    if (repeatsData.repeatType == 2 && repeatsData.days?.length < 1) {
      this.form.controls.repeatType.setValue(0);
      repeatsData.days = null;
      repeatsData.repeatType = 0;
    }
    if (repeatsData.repeatType == 1 && repeatsData.dates?.length < 1) {
      this.form.controls.repeatType.setValue(0);
      repeatsData.dates = null;
      repeatsData.repeatType = 0;
    }
      
    let data = {
      // task_id: this.selectedData?.id,
      // region_id: this.regionId,
      // task_name: this.form.get('taskName').value,
      // task_priority: 1,  //Normal,
      // points: this.form.get('points').value,
      // all_stores: this.form.get('isAllStores').value == '0' || !this.permissions?.Tasks?.add_bulk ? false : true,
      // all_shifts: Boolean(this.isAllChecked),
      // task_repeats: this.isAllChecked ? 1 : null,
      // shift_id: this.isAllChecked ? null : shiftsData,
      description: this.form.get('description').value,
      tags: this.form.get('tagName').value,
      custom: repeatsData
    };
    return data;

  }

  addUpdateTaskTags = async () => {
    let dataModel = await this.createDataModal();
    let data = {
      "task_id": this.taskId,
      "tags": dataModel.tags,
    }
    try {
      this.loading = true;
      const response: any = await this.service.addUpdateTaskTags(data);
      this.gs.showToastSuccess(response?.message);
      this.ref.close(dataModel);
    } catch (error) {
      this.gs.showToastError(error.message);
      console.log(error)
    } finally {
      this.loading = false;
    }
  }

  async close(val) {
    let data = val ? await this.createDataModal() : null;
    if (val && this.isAddEditTagsOnly) {
      this.addUpdateTaskTags();
    } else {
      this.ref.close(data);
    }
  }

}
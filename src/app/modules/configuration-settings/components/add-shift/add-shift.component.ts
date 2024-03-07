import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormArray, FormBuilder, FormGroup, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { GeneralService } from 'src/app/core/services/general.service';
import { NewAnnouncementComponent } from 'src/app/modules/recognition/components/new-announcement/new-announcement.component';
import { RecognitionService } from 'src/app/modules/recognition/recognition.service';
import { ConfigurationSettingsService } from '../../configuration-settings.service';

@Component({
  selector: 'app-add-shift',
  templateUrl: './add-shift.component.html',
  styleUrls: ['./add-shift.component.scss']
})
export class AddShiftComponent implements OnInit {
  @ViewChild('ngForm') ngForm: NgForm;
  @Input() store;
  @Input() isEdit: boolean;
  loading: boolean;
  AddShiftForm: FormGroup;
  shiftIcons = [
    { value: 'fas fa-mountain-sun blue', key: 'fa-mountain-sun'},
    { value: 'fas fa-sun orange', key: 'fa-sun'},
    { value: 'fas fa-moon dark-blue', key: 'fa-moon' },
    { value: 'fas fa-utensils teal', key: 'fa-utensils' },
    { value: 'fas fa-person-walking-luggage greyish-blue', key: 'fa-person-walking-luggage' },
    { value: 'fas fa-mug-hot  brown', key: 'fa-mug-hot' },
    { value: 'fas fa-people-arrows  purple', key: 'fa-people-arrows' },
    { value: 'fas fa-plane greyish-blue', key: 'fa-plane greyish-blue' },
    { value: 'fas fa-calendar-xmark dark-blue', key: 'fa-calendar-xmark dark-blue' },
    { value: 'fas fa-person-walking-arrow-loop-left teal', key: 'fa-person-walking-arrow-loop-left' },
  ]
  isAddAnother: boolean;
  isAllChecked: string;

  constructor(
    private fb: FormBuilder,
    private ref: NbDialogRef<AddShiftComponent>,
    private service: ConfigurationSettingsService,
    private gs: GeneralService
  ) {
    this.store = this.store;
    this.isAddAnother = false;
    this.isAllChecked = '0';
  }

  ngOnInit(): void {
    if (this.isEdit) {
      this.EditShiftFormValues();
    } else {
      this.AddShiftFormValues();
    }
  }

  close(openNext): void {
    this.ref.close(openNext);
  }

  setIcon(shift, icon) {
    shift.controls.icon.setValue(icon);
  }

  deleteShift(shift) {
    shift.controls.is_deleted.setValue(1);
  }

  hasAllDeletedShifts() {
    const res = this.shifts.controls.filter(s => s.value.is_deleted !== 1);
    return res && res.length > 0 ? false : true;
  }
 
  AddShiftFormValues = () => {
    this.AddShiftForm = this.fb.group({
      shiftsArray: new FormArray([
        this.fb.group({
          id: [null],
          name: ['', [Validators.required, Validators.maxLength(50)]],
          icon: [this.shiftIcons[0].value, [Validators.required]],
          shiftStartTime: ['', [Validators.required]],
          shiftEndTime: ['', [Validators.required]]
        },   
        {
          validator: [this.timeValidator],
        } as AbstractControlOptions)
      ]),
    }, 
    );
  }

  EditShiftFormValues = () => {
    this.AddShiftForm = this.fb.group({
      shiftsArray: this.populateShifts(),
    });
  }

  populateShifts() {
    let arr = new FormArray([]);
    this.store.shifts.forEach(shift => {
      if (shift.start_time) {
        arr.push(
          this.fb.group({
            id: [shift.id],
            name: [shift.name, [Validators.required, Validators.maxLength(50)]],
            icon: [shift.icon, [Validators.required]],
            shiftStartTime: [this.gs.changeTimezone(new Date(shift.start_time), this.store.default_timezone), [Validators.required]],
            shiftEndTime: [this.gs.changeTimezone(new Date(shift.end_time), this.store.default_timezone), [Validators.required]],
            is_deleted: 0
          },
          { validator: [this.timeValidator],
          } as AbstractControlOptions)
        );
      }
    });
    return arr;
  }

  get form() {
    return this.AddShiftForm.controls;
  }
  get shifts() {
    return this.form.shiftsArray as FormArray;
  }

  submit(ngForm) {
    if (ngForm.valid) {
      this.loading = true;
      if (this.isEdit) {
        this.editShift();
      } else {
        this.addShift();
      }
    }
  }

  getShifts() {
    let arr = [];
    this.shifts.controls.forEach(shift => {
      arr.push({
        id: this.isEdit ? shift.get('id').value : null,
        name: shift.get('name').value,
        start_time: shift.get('shiftStartTime').value.toLocaleTimeString('it-IT'),
        end_time: shift.get('shiftEndTime').value.toLocaleTimeString('it-IT'),
        icon: shift.get('icon').value,
        is_deleted: this.isEdit ? shift.get('is_deleted').value : 0
      });
    });
    return arr;
  }

  async editShift() {
    const data = {
      region_id: this.store.id,
      shifts: this.getShifts()
    }
    try {
      const response: any = await this.service.updateShifts(data);
      this.gs.showToastSuccess(response?.message);
      this.close(true);
    } catch (error) {
      this.gs.showToastError(error.message);
      console.log(error)
    } finally {
      this.loading = false;
    }
  }

  async addShift() {
    const data = {
      region_id: this.isAllChecked === '1' ? null : this.store.id,
      shift: this.getShifts()[0]
    }
    try {
      const response: any = await this.service.addNewShift(data);
      this.gs.showToastSuccess(response?.message);
      this.close(this.isAddAnother ? false : true);
      if (this.isAddAnother) {
        if (this.store.shifts) {
          this.store.shifts.push(data.shift)
        } else {
          this.store['shifts'] = [data.shift];
        }
      }
    } catch (error) {
      this.gs.showToastError(error.message);
      console.log(error)
    } finally {
      this.loading = false;
    }
  }

  timeValidator: ValidatorFn = (group: FormGroup): ValidationErrors | null => {
    if ((group.get('shiftStartTime').value != null && group.get('shiftEndTime').value != '') && (group.get('shiftStartTime').value != null && group.get('shiftStartTime').value != '')) {
      const tStart = new Date(group.get('shiftStartTime').value);
      const tEnd = new Date(group.get('shiftEndTime').value);

      tStart.setSeconds(0, 0);
      tEnd.setSeconds(0, 0);

      const differenceInMins = (tEnd.getTime() - tStart.getTime()) / 60000;
      let invalidSlot;

      if (differenceInMins > 0 && differenceInMins < 60) {
        invalidSlot = true;
      }

      let result = {};
      if (invalidSlot) {
        result = {
          invalidSlot,
        };
      }

      if (Object.keys(result)?.length === 0) {
        tStart?.setHours(0, 0, 0, 0);
        tEnd?.setHours(23, 59, 0, 0);
      }
      return result;
    }
    return null;
  };
}

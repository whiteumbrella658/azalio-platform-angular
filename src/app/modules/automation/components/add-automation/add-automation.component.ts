import { Component, Input, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { apiUrl } from 'src/api-url';
import { ApiService } from 'src/app/core/http/api.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { AutomationService } from '../../automation.service';

@Component({
  selector: 'app-add-automation',
  templateUrl: './add-automation.component.html',
  styleUrls: ['./add-automation.component.scss']
})
export class AddAutomationComponent implements OnInit {
  @Input() regionId;
  AutomationForm: FormGroup;
  usersList: any;
  userLoading: boolean;
  scheduleMessageList = [
    { display: '1 hrs', value: 1 },
    { display: '2 hrs', value: 2 },
    { display: '4 hrs', value: 4 },
    { display: '12 hrs', value: 12 }
  ];
  receiveUpdateList = [
    { display: '15 mins', value: 0.25, disabled: false },
    { display: '30 mins', value: 0.5, disabled: false },
    { display: '1 hrs', value: 1, disabled: false },
    { display: '2 hrs', value: 2, disabled: false }
  ];
  runUntilList = [
    { value: 2, label: '2 weeks' },
    { value: 4, label: '4 weeks' },
    { value: 12, label: '12 weeks' }
  ];
  confirmSchedulesList = [
    { value: true, label: 'Yes', disabled: true },
    { value: false, label: 'No, only schedules where start time falls between' },
  ]
  runUntilDate: Date;
  loading: any;
  isGraveyard: boolean;

  constructor(
    private service: AutomationService,
    public gs: GeneralService,
    private http: ApiService,
    private fb: FormBuilder,
    private ref: NbDialogRef<AddAutomationComponent>,
  ) { }

  ngOnInit(): void {
    this.AutomationForm = this.fb.group({
      user: ['', Validators.required],
      shift: this.fb.group({
        start: [''],
        end: ['']
      },
      { validator: [this.timeValidator]} as AbstractControlOptions),
      allSchedules: [false, Validators.required],
      scheduleMessage: ['', Validators.required],
      receiveUpdate: ['', Validators.required],
      runUntil: [4, Validators.required],
    })
    this.updateValidators();
    // this.AutomationForm = this.fb.group({
    //   user: [''],
    // shift: this.fb.group({
    //   start: [''],
    //   end: ['']
    // }),
    //   allSchedules: [false],
    //   scheduleMessage: [''],
    //   receiveUpdate: [''],
    //   runUntil: [4],
    // })
    this.calculateDate();
    this.getUsers();
  }

  setDropdownValidation() {
    const hours = this.AutomationForm.get('scheduleMessage').value;
    const receiveUpdateHours = this.AutomationForm.get('receiveUpdate').value;
    this.receiveUpdateList.forEach(x=> {
      x.disabled = x.value < hours ? false : true;
      if (x.disabled && receiveUpdateHours == x.value) {
        this.AutomationForm.controls.receiveUpdate.setValue('');
      }
    });
  }

  submit() {
    if (this.loading) {
      return;
    }
    const userId = this.AutomationForm.get('user').value;
    const data = {
      region_id: this.regionId,
      user_id: userId == -1 ? null : userId,
      all_schedules: this.AutomationForm.get('allSchedules').value, //if true, start & end times will not be sent. 
      request_confirmation_before_hours: this.AutomationForm.get('scheduleMessage').value, //will not be decimal
      send_response_by_hours: this.AutomationForm.get('receiveUpdate').value, //can also be decimal 
      run_until: this.runUntilDate.toISOString()
    }
    if (!data.all_schedules) {
      Object.assign(data, {
        schedule_start_time: this.AutomationForm.get('shift').get('start').value.toLocaleTimeString('it-IT'),
        schedule_end_time: this.AutomationForm.get('shift').get('end').value.toLocaleTimeString('it-IT'),
        is_graveyard: this.isGraveyard
      });
    }
    console.log(data);
    this.addAutomation(data);
  }

  async addAutomation(data) {
    try {
      this.loading = true;
      const response: any = await this.service.addAutomation(data);
      this.gs.showToastSuccess(response?.message);
      this.close(true);
    } catch (error) {
      this.gs.showToastError(error.message);
      console.log(error)
    } finally {
      this.loading = false;
    }
  }

  updateValidators() {
    setTimeout(() => {
      let form = this.AutomationForm.controls.allSchedules;
      let shiftForm = this.AutomationForm.controls.shift as FormGroup;
      if (form.value == true) {
        shiftForm.controls.start.setValidators([]);
        shiftForm.controls.start.updateValueAndValidity();
        shiftForm.controls.end.setValidators([]);
        shiftForm.controls.end.updateValueAndValidity();
      } else {
        shiftForm.controls.start.setValidators([Validators.required]);
        shiftForm.controls.start.updateValueAndValidity();
        shiftForm.controls.end.setValidators([Validators.required]);
        shiftForm.controls.end.updateValueAndValidity();
      }
    }, 200);
  }


  calculateDate() {
    setTimeout(() => {
      let numOfWeeks = this.AutomationForm.get('runUntil').value;
      let today = new Date();
      today.setHours(0, 0, 0, 0);
      this.runUntilDate = this.gs.getNextDate(today, numOfWeeks * 7);
    }, 200);
  }

  getUsers() {
    if (!this.regionId) {
      return;
    }
    this.userLoading = true;
    const url = apiUrl.organisation.get.UsersByRegionTeamIds + '?region_id=' + this.regionId;
    this.http.get(url).subscribe((res: any) => {
      this.usersList = [...[{ id: -1, name: 'All employees in the store', disabled: true }], ...res];
      this.userLoading = false;
    }, error => {
      console.log(error);
      this.userLoading = false;
    });
  }

  close(openNext): void {
    this.ref.close(openNext);
  }

  timeValidator: ValidatorFn = (group: FormGroup): ValidationErrors | null => {
    if (this.AutomationForm && this.AutomationForm.get('allSchedules').value == 1) {
      return null;
    }
    if ((group.get('start').value != null && group.get('end').value != '') && (group.get('start').value != null && group.get('start').value != '')) {
      const tStart = new Date(group.get('start').value);
      let tEnd = new Date(group.get('end').value);

      tStart.setSeconds(0, 0);
      tEnd.setSeconds(0, 0);
      this.isGraveyard = false;
      if (tStart.getTime() > tEnd.getTime()) {
        this.isGraveyard = true;
        tEnd = this.gs.getNextDate(tEnd, 1);
      }
      const differenceInMins = (tEnd.getTime() - tStart.getTime()) / 60000;

      let invalidSlot;
      let invalidMaxSlot;

      if (differenceInMins >= 0) {
        if (differenceInMins == 0 || differenceInMins < 60) {
          invalidSlot = true;
        } else if (differenceInMins > 60 * 12 ) {
          invalidMaxSlot = true;
        }
      }
  
      let result = {};

      if (invalidSlot) {
        result = {
          invalidSlot,
        };
      } else if (invalidMaxSlot) {
        result = {
          invalidMaxSlot,
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



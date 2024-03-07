import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControlName } from '@angular/forms';
import { NbDateAdapterService, NbDatepicker } from '@nebular/theme';
import { GeneralService } from 'src/app/core/services/general.service';

@Component({
  selector: 'app-timer-input',
  templateUrl: './timer-input.component.html',
  styleUrls: ['./timer-input.component.scss'], 
})
export class TimerInputComponent implements OnInit {
  // @ViewChild('datePicker') datePicker;

  @Input() form: FormGroup;
  @Input() controlName: FormControlName;
  @Input() minDate: Date;
  @Input() maxDate: Date;
  @Input() appendedTo = 'body';
  @Input() dateType='date';
  @Input() onlyTime: boolean;
  @Input() onlyTimePicker: boolean;
  @Input() onlyDate: boolean;
  @Input() filter: boolean;
  public yearRange;
  @Input() placeholder: String;
  date: any;

  constructor(private gs: GeneralService) {
    this.placeholder = this.placeholder ? this.placeholder : 'Select date and time';
    this.onlyTime = this.onlyTime ? true : false;
    this.onlyTimePicker = this.onlyTimePicker ? true : false;
    this.onlyDate = this.onlyDate ? true : false;
    this.filter = this.filter ? this.filter : true;
  }

  ngOnInit(): void {
    let minDateInput = this.minDate;
    this.minDate = this.minDate ? this.minDate : new Date(1900, 0, 1);
    this.maxDate = this.maxDate ? this.maxDate : new Date();
    this.yearRange = this.minDate.getFullYear() + ":" + this.maxDate.getFullYear();
    if (this.onlyDate) {
      this.minDate = minDateInput ? minDateInput : this.gs.getPrevDate(new Date(), 1);
    }
  }

  setClass() {
    setTimeout(() => {
      let elem = document.getElementsByTagName('nb-calendar-with-time');
      console.log(elem);
      if (elem && elem[0]) {
        elem[0].className = "shift-hrs-picker";
      }
    },150);
  }

  hideFooter() {
    setTimeout(() => {
      let elem = document.getElementsByTagName('nb-card-footer');
      let elem2 = document.getElementsByTagName('nb-calendar-actions');
      if (elem && elem[0]) {
        elem[0].className = "padding-2px";
      }
      if (elem2 && elem2[0]) {
        elem[0].className = "d-none";
      }
    }, 150);
  }

  onValueChange($event) {
    // let val = $event.target.value;
    this.form.controls[this.controlName.toString()].setValue(this.gs.getPrevDate(new Date(), 2));
    setTimeout(() => {
          this.form.controls[this.controlName.toString()].setValue(null);
    });
  }

  onSelectTime($event) {
    this.form.controls[this.controlName.toString()].setValue($event.time);
  }

}



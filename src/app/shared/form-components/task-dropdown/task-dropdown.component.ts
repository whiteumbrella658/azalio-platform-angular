import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges,OnChanges } from '@angular/core';
import { FormGroup, FormControlName } from '@angular/forms';

@Component({
  selector: 'app-task-dropdown',
  templateUrl: './task-dropdown.component.html',
  styleUrls: ['./task-dropdown.component.scss']
})
export class TaskDropdownComponent implements OnChanges {
  @Input() form: FormGroup;
  @Input() controlName: FormControlName;
  @Input() tasks: any;
  disabled: Boolean = true;
  @Input() placeholder: String;

  constructor() {
    this.placeholder = this.placeholder ? this.placeholder : 'Select Task';
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.tasks?.length !== 0) {
      this.disabled = false;
    } else {
      this.disabled = true;
    }
  }
}

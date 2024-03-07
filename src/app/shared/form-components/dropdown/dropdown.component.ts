import { Component, Input, OnInit, Output,EventEmitter, SimpleChanges } from '@angular/core';
import { FormControlName, FormGroup } from '@angular/forms'

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {

  @Input() form: FormGroup;
  @Input() controlName: FormControlName;
  @Input() Data;
  @Input() placeholder;
  @Input() show;
  @Input() optionClass;
  @Input() display;
  @Input() display2;
  @Input() displayDate;
  @Input() key;
  @Input() selectedInput;
  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();

  //data: any;
  selectedValue;
  selected: any;
  constructor() { 
    this.display = this.display ? this.display : 'value';
    this.display2 = this.display2 ? this.display2 : '';
    this.displayDate = this.displayDate ? this.displayDate : '';
    this.key = this.key ? this.key : 'key';
    this.optionClass = this.optionClass ? this.optionClass : '';
  }
  

  ngOnInit(): void {
    this.setSelected(this.form.controls[this.controlName.toString()].value)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedInput && changes.selectedInput.previousValue !== changes.selectedInput.currentValue) {
      this.setSelected(changes.selectedInput.currentValue);
    }
  }

  setSelected(event) {
    this.selected = this.Data.filter(x=> x[this.key] == event)[0];
  }

  change(event) {
    this.setSelected(event);
    this.valueChange.emit(event);
  }
}

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControlName, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent implements OnInit, OnChanges {

  @Input() form: FormGroup;
  @Input() controlName: FormControlName;
  @Input() placeholder: string;
  @Input() autofocus: boolean = false;
  @Input() disabled:boolean;
  @Input() type: string;
  @Input() id: string;
  @Input() maxlength: number;
  @Output() focus: EventEmitter<null> = new EventEmitter<null>();
  @Output() focusOut: EventEmitter<null> = new EventEmitter<null>();
  @Input() fieldSize: string;
  
  constructor() { 
  }

  ngOnInit(): void {
    // this.id = this.id ? this.id : 'task-input';
    this.type = this.type ? this.type : 'text';
    this.placeholder = this.placeholder ? this.placeholder : '';
    this.fieldSize = this.fieldSize ? this.fieldSize : 'medium';
    this.maxlength = this.maxlength ? this.maxlength : null;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.type && changes.type.currentValue !== changes.type.previousValue) {
      this.type = changes.type.currentValue;
    }
    
  }

  onfocus() {
    this.focus.emit();
  }

  onfocusout() {
    this.focusOut.emit();
  }


}

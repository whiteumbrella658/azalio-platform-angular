import { ThisReceiver } from '@angular/compiler';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControlName, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dropdown-multi',
  templateUrl: './dropdown-multi.component.html',
  styleUrls: ['./dropdown-multi.component.scss']
})
export class DropdownMultiComponent implements OnInit, OnChanges {

  @Input() form: FormGroup;
  @Input() controlName: FormControlName;
  @Input() key;
  @Input() optionId;
  @Input() Data;
  @Input() placeholder;
  @Input() show;
  @Input() optionClass;
  @Input() selected;
  @Input() defaultOpen;
  @Input() label;
  @Input() type;
  @Input() key2;
  @Input() max;
  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();

  id: any;
  selectedItems: any;
  constructor() { 
    this.max = this.max ? this.max : null;
    this.optionClass = this.optionClass ? this.optionClass : '';
    this.label = this.label ? this.label : 'shifts';
  }
  

  ngOnInit(): void {
    this.id = this.optionId ? this.optionId : 'id';
    this.updateSelected();
  }

  updateSelected() {
    this.selectedItems = this.selected ? this.Data.filter(x=> {
      if (this.selected.includes(x[this.optionId])) {return x}
    }) : [];
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selected && changes.selected.previousValue !== changes.selected.currentValue) {
      this.selected = changes.selected.currentValue;
      this.updateSelected();
    }
    if (changes.defaultOpen && changes.defaultOpen.previousValue !== changes.defaultOpen.currentValue) {
      this.defaultOpen = changes.defaultOpen.currentValue;
      setTimeout(() => {
        const el = document.getElementById('dropdown-display') as HTMLElement;
        if (el) {
          el.click();
        }
      });
    }
  }

  revertSelection() {
    if (!this.max) {
      return;
    }
    if (this.selected?.length > this.max) {
      this.selected.pop();
      this.updateSelected();
    }
  }

  change(event) {
    // console.log(event);
    this.updateSelected();
    this.valueChange.emit(event);
  }

}


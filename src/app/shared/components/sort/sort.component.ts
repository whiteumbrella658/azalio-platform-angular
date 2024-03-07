import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.scss']
})
export class SortComponent implements OnInit {
  @Output() onSort: EventEmitter<Number> = new EventEmitter<Number>();
  isAscending: boolean;
  @Input() label;
  @Input() isSelected: boolean;
  @Input() iconType: string;
  @Input() order: any;
  @Input() isBtnStyle: boolean;
  icons: any = {
    number: {
      ascending: 'fas fa-arrow-down-1-9',
      descending: 'fas fa-arrow-down-9-1'
    },
    alpha: {
      ascending: 'fas fa-arrow-down-a-z',
      descending: 'fas fa-arrow-down-z-a'
    }
  }
  ascendingClass: string;
  descendingClass: any;

  constructor() {
    this.label = this.label ? this.label : '';
    this.iconType = this.iconType ? this.iconType : 'alpha';
    this.isSelected = this.isSelected ? this.isSelected : false;
   }

  ngOnInit(): void {
    this.isAscending = true;
    this.order = this.order ? this.order : 1;
    this.isAscending = this.order > 0 ? true : false;
    this.ascendingClass = this.icons[this.iconType].ascending;
    this.descendingClass = this.icons[this.iconType].descending;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isSelected && changes.isSelected.currentValue !== changes.isSelected.previousValue) {
      this.isSelected = changes.isSelected.currentValue;
    }
  }

  toggleSort() {
    this.isAscending = !this.isAscending;
    this.onSort.emit(this.isAscending ? 1 : -1);
  }

}

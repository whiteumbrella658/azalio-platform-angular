import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { isString } from '@mobiscroll/angular/dist/js/core/util/misc';

@Component({
  selector: 'app-filter-popup',
  templateUrl: './filter-popup.component.html',
  styleUrls: ['./filter-popup.component.scss']
})
export class FilterPopupComponent implements OnInit, OnChanges {
  @Input() isFiltered: boolean;
  @Input() label: string;
  @Input() hideRespLabel: string;
  @Input() icon: string;
  @Input() isBtnStyle: boolean;
  @Output() onApply: EventEmitter<any> = new EventEmitter<any>();
  @Output() onClear: EventEmitter<any> = new EventEmitter<any>();
  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();
  @Output() onOpen: EventEmitter<any> = new EventEmitter<any>();

  classesToExclude = ['multiple'] //classes added here will not close the popup if clicked on


  @HostListener('document:click', ['$event'])
  clickout(event) {
    // console.log(event.target.className);
    const cl = event.target.className;
    if(!this.eRef.nativeElement.contains(event.target) && this.isExcludedClass(cl)) {
      this.showPopup = false;
      this.onClose.emit();
    }
  }

  isExcludedClass(className) {
    if (typeof className !== 'string') {
      return;
    }
    const res = this.classesToExclude.findIndex(x=> className.includes(x));
    return res == -1 ? true : false;
  }


  showPopup: boolean = false;


  constructor(private eRef: ElementRef) { }

  ngOnInit(): void {
    this.icon = this.icon ? this.icon : 'fa fa-filter';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isFiltered && changes.isFiltered.currentValue !== changes.isFiltered.previousValue) {
      this.isFiltered = changes.isFiltered.currentValue;
    }
  }

  toggleFilter() {
    this.showPopup = !this.showPopup;
    if (this.showPopup) {
      this.onOpen.emit();
    }
  }

  clear() {
    this.isFiltered = false;
    this.showPopup = false;
    this.onClear.emit();
  }
  apply() {
    this.isFiltered = true;
    this.showPopup = false;
    this.onApply.emit();
  }
  applyEnter() {
    // setTimeout(() => {
    //   this.showPopup = false;
    // });
    this.isFiltered = true;
    this.onApply.emit();
  }

}

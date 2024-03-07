import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NbPopoverDirective } from '@nebular/theme';

@Component({
  selector: 'app-confirm-popup',
  templateUrl: './confirm-popup.component.html',
  styleUrls: ['./confirm-popup.component.scss']
})
export class ConfirmPopupComponent {
  @ViewChild(NbPopoverDirective) popover: NbPopoverDirective;
  @Output() proceedDelete: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() proceedWithComment: EventEmitter<any> = new EventEmitter<any>();
  @Output() proceedSave: EventEmitter<null> = new EventEmitter<null>();
  @Output() proceedCancel: EventEmitter<null> = new EventEmitter<null>();
  @Input() textToDisplay;
  @Input() className: string;
  @Input() title;
  @Input() type;
  @Input() checkboxLabel;
  @Input() isComment;
  @Input() status;
  @Input() displayOnly;
  isChecked: boolean;
  reason: string;

  constructor() {

    this.reason = '';
    this.isChecked = false;
    this.checkboxLabel = this.checkboxLabel;
    this.textToDisplay = this.textToDisplay ? this.textToDisplay : 'Are you sure you want to proceed?';
    this.type = this.type ? this.type : 'Delete';
    this.isComment = this.isComment ? this.isComment : false;
    this.status = this.status ? this.status : 'danger';
    this.displayOnly = this.displayOnly ? this.displayOnly : false;
  }

  ngOnInit() {
    this.className = this.className ? this.className : '';
  }

  proceed() {
    this.proceedSave.emit();
    if (this.isComment && this.reason != '') {
      this.proceedWithComment.emit({isChecked: this.isChecked, reason: this.reason});
    } else {
      this.proceedDelete.emit(this.isChecked);
    }
    this.close();
  }

  open() {
    this.popover.show();
  }

  close() {
    this.popover.hide();
    this.proceedCancel.emit();
  }

}

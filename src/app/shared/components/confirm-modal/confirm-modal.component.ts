import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent {
  // @Output() onProceed: EventEmitter<null> = new EventEmitter<null>();
  // @Output() onCancel: EventEmitter<null> = new EventEmitter<null>();
  @Input() heading;
  @Input() subHeading;
  @Input() dynamicElems;
  @Input() proceedButtonText;
  @Input() cancelButtonText;
  isSendNotification: boolean = false;

  constructor(private ref: NbDialogRef<ConfirmModalComponent>) { 
  }

  ngOnInit(): void {
    this.heading = this.heading ? this.heading : 'You have unsaved changes';
    this.subHeading = this.subHeading ? this.subHeading : 'Are you sure you want to navigate to another module? If you continue, you\'ll lose your changes to the settings.';
    this.dynamicElems = this.dynamicElems ? this.dynamicElems : false;
    this.proceedButtonText = this.proceedButtonText ? this.proceedButtonText : 'Yes';
    this.cancelButtonText = this.cancelButtonText ? this.cancelButtonText : 'No';
  }

  proceed() {
    //proceed changes & close
    this.close(true);
  }

  cancel() {
    //revert changes & close
    this.close(false);
  }

  close(isActionConfirmed) {
    let res = {isActionConfirmed: isActionConfirmed, isSendNotification: this.isSendNotification }
    this.ref.close(!this.dynamicElems ? isActionConfirmed : res);
  }

}

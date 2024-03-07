import { Component, Input, OnInit } from '@angular/core';
import {NbDialogRef} from '@nebular/theme';

@Component({
  selector: 'app-view-errors',
  templateUrl: './view-errors.component.html',
  styleUrls: ['./view-errors.component.scss']
})
export class ViewErrorsComponent {

  constructor(private ref:NbDialogRef<ViewErrorsComponent>) { }
  @Input() data;

  close(openNext) {
    this.ref.close(openNext);
  }
}


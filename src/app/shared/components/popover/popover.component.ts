import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent {
  @Input() pop_array;
  @Input() key;
  @Input() displayProperty;
  @Input() slicedCount;

  regions: any;

  constructor() {}
}

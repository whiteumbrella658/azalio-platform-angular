import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Input() className: string;
  @Input() classNext: string = '';
  @Input() appearance: string;
  @Output() onClick: EventEmitter<null> = new EventEmitter<null>();
  fullClass: string;
  
  constructor() { 
  }

  ngOnInit(): void {
    this.appearance = this.appearance ? this.appearance : 'ghost';  
    let parentClass =  this.className ? this.className : 'cancel';
    this.fullClass =  parentClass + ' ' + this.classNext;
  }

  click() {
    this.onClick.emit();
  }

}

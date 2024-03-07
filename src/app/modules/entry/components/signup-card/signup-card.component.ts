import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-signup-card',
  templateUrl: './signup-card.component.html',
  styleUrls: ['./signup-card.component.scss']
})
export class SignupCardComponent implements OnInit {
  @Output() onButtonClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  onClick() {
    this.onButtonClick.emit();
  }

  onClose() {
    this.onCancel.emit();
  }

}

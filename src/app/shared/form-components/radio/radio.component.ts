import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControlName } from '@angular/forms';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss']
})
export class RadioComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() controlName: FormControlName;
  @Input() items: any;

  constructor() { }

  ngOnInit(): void {
  }

}

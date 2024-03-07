import { Component, Input, OnInit,EventEmitter,Output } from '@angular/core';
import { FormGroup, FormControlName } from '@angular/forms';
import * as moment from 'moment-timezone';
import { config } from 'src/environments/configuration';
import {timezoneMapping } from 'src/constants';
@Component({
  selector: 'app-timezone-dropdown',
  templateUrl: './timezone-dropdown.component.html',
  styleUrls: ['./timezone-dropdown.component.scss']
})
export class TimezoneDropdownComponent implements OnInit  {
  @Input() form: FormGroup;
  @Input() controlName: FormControlName;
  @Input() placeholder: String;
  @Input() currentValue: String;
  @Input() showName:boolean;
  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();
  
  timezones: { key: string; name: string }[];

  constructor() {
   this.timezones=timezoneMapping;
  }

  ngOnInit(): void {
    if ((config.environment?.toLowerCase() === 'prod' || config.environment?.toLowerCase() === 'production')) {
     this.timezones = this.timezones.filter(function( obj ) {
      return obj.key !== 'PKT';
    });
     }  
     this.placeholder = this.placeholder ? this.placeholder : 'Select Time Zone';
  }

}


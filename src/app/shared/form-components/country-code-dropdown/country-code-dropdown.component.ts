import { Component, Input, OnInit } from '@angular/core';
import { FormControlName, FormGroup } from '@angular/forms';
import { GeneralService } from 'src/app/core/services/general.service';
import { config } from 'src/environments/configuration';
import { countries } from 'src/constants';

@Component({
  selector: 'app-country-code-dropdown',
  templateUrl: './country-code-dropdown.component.html',
  styleUrls: ['./country-code-dropdown.component.scss']
})
export class CountryCodeDropdownComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() controlName: FormControlName;
  
  selectedCountry;
  countries: { code: string; img: string; }[];


constructor() {
  this.countries = countries.slice();
  // if (config.environment?.toLowerCase() === 'prod' || config.environment?.toLowerCase() === 'production') {
  //     this.countries = [this.countries[0]];
  // } else {
  //   this.countries = [this.countries[0], this.countries[1]];
  // }
}

  ngOnInit(): void {
    const code = this.form.controls.countrycode.value?.code;
    const result = this.countries.filter(x=> x.code === code);
    const value = result && result.length > 0 ? result[0] : this.countries[0];
    this.form.controls.countrycode.setValue(value);
    this.selectedCountry = value ? value : this.countries[0];
  }

}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryCodeDropdownComponent } from './country-code-dropdown.component';

describe('CountryCodeDropdownComponent', () => {
  let component: CountryCodeDropdownComponent;
  let fixture: ComponentFixture<CountryCodeDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountryCodeDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryCodeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

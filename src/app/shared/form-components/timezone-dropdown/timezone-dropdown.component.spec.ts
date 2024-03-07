import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimezoneDropdownComponent } from './timezone-dropdown.component';

describe('TimezoneDropdownComponent', () => {
  let component: TimezoneDropdownComponent;
  let fixture: ComponentFixture<TimezoneDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimezoneDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimezoneDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

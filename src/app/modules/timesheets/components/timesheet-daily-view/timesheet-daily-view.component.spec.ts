import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetDailyViewComponent } from './timesheet-daily-view.component';

describe('TimesheetDailyViewComponent', () => {
  let component: TimesheetDailyViewComponent;
  let fixture: ComponentFixture<TimesheetDailyViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimesheetDailyViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimesheetDailyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

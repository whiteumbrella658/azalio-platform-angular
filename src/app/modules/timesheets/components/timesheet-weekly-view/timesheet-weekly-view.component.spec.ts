import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetWeeklyViewComponent } from './timesheet-weekly-view.component';

describe('TimesheetWeeklyViewComponent', () => {
  let component: TimesheetWeeklyViewComponent;
  let fixture: ComponentFixture<TimesheetWeeklyViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimesheetWeeklyViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimesheetWeeklyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

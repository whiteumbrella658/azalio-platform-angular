import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommSchedulesComponent } from './comm-schedules.component';

describe('CommSchedulesComponent', () => {
  let component: CommSchedulesComponent;
  let fixture: ComponentFixture<CommSchedulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommSchedulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommSchedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

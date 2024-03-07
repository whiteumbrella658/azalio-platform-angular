import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileSchedulerComponent } from './mobile-scheduler.component';

describe('MobileSchedulerComponent', () => {
  let component: MobileSchedulerComponent;
  let fixture: ComponentFixture<MobileSchedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileSchedulerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcessMobileSchedulerComponent } from './acess-mobile-scheduler.component';

describe('AcessMobileSchedulerComponent', () => {
  let component: AcessMobileSchedulerComponent;
  let fixture: ComponentFixture<AcessMobileSchedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcessMobileSchedulerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcessMobileSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreAppSchedulerComponent } from './store-app-scheduler.component';

describe('StoreAppSchedulerComponent', () => {
  let component: StoreAppSchedulerComponent;
  let fixture: ComponentFixture<StoreAppSchedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreAppSchedulerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreAppSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

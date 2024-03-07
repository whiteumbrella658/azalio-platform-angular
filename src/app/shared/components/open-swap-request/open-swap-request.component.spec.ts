import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenSwapRequestComponent } from './open-swap-request.component';

describe('OpenSwapRequestComponent', () => {
  let component: OpenSwapRequestComponent;
  let fixture: ComponentFixture<OpenSwapRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenSwapRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenSwapRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpCommPageComponent } from './emp-comm-page.component';

describe('EmpCommPageComponent', () => {
  let component: EmpCommPageComponent;
  let fixture: ComponentFixture<EmpCommPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpCommPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpCommPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

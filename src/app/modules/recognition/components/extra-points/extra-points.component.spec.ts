import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraPointsComponent } from './extra-points.component';

describe('ExtraPointsComponent', () => {
  let component: ExtraPointsComponent;
  let fixture: ComponentFixture<ExtraPointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtraPointsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

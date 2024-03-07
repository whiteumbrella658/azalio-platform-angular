import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequiredFeaturesComponent } from './required-features.component';

describe('RequiredFeaturesComponent', () => {
  let component: RequiredFeaturesComponent;
  let fixture: ComponentFixture<RequiredFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequiredFeaturesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequiredFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

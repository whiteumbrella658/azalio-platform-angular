import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizeLabelsComponent } from './customize-labels.component';

describe('CustomizeLabelsComponent', () => {
  let component: CustomizeLabelsComponent;
  let fixture: ComponentFixture<CustomizeLabelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomizeLabelsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomizeLabelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimateIconsComponent } from './animate-icons.component';

describe('AnimateIconsComponent', () => {
  let component: AnimateIconsComponent;
  let fixture: ComponentFixture<AnimateIconsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimateIconsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimateIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

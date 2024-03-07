import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnablePlayComponent } from './enable-play.component';

describe('EnablePlayComponent', () => {
  let component: EnablePlayComponent;
  let fixture: ComponentFixture<EnablePlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnablePlayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnablePlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

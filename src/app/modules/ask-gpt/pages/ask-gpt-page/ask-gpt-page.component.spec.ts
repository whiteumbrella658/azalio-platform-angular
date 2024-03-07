import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskGptPageComponent } from './ask-gpt-page.component';

describe('AskGptPageComponent', () => {
  let component: AskGptPageComponent;
  let fixture: ComponentFixture<AskGptPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AskGptPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AskGptPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

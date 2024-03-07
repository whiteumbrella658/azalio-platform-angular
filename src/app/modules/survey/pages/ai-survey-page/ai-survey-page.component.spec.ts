import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiSurveyPageComponent } from './ai-survey-page.component';

describe('AiSurveyPageComponent', () => {
  let component: AiSurveyPageComponent;
  let fixture: ComponentFixture<AiSurveyPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AiSurveyPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AiSurveyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

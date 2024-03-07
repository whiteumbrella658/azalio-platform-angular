import { TestBed } from '@angular/core/testing';

import { AiSurveyService } from './ai-survey.service';

describe('AiSurveyService', () => {
  let service: AiSurveyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiSurveyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

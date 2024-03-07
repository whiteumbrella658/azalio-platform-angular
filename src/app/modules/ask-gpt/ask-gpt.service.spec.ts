import { TestBed } from '@angular/core/testing';

import { AskGptService } from './ask-gpt.service';

describe('AskGptService', () => {
  let service: AskGptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AskGptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

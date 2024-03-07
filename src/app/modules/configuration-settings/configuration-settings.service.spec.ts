import { TestBed } from '@angular/core/testing';

import { ConfigurationSettingsService } from './configuration-settings.service';

describe('ConfigurationSettingsService', () => {
  let service: ConfigurationSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigurationSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { EzyinsightService } from './ezyinsight.service';

describe('EzyinsightService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EzyinsightService = TestBed.get(EzyinsightService);
    expect(service).toBeTruthy();
  });
});

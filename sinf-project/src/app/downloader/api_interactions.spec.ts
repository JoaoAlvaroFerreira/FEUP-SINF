import { TestBed } from '@angular/core/testing';

import { ApiInteractions } from './api_interactions';

describe('ApiInteractions', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiInteractions = TestBed.get(ApiInteractions);
    expect(service).toBeTruthy();
  });
});

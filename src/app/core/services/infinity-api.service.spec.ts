import { TestBed } from '@angular/core/testing';

import { InfinityApiService } from './infinity-api.service';

describe('InfinityApiService', () => {
  let service: InfinityApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfinityApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

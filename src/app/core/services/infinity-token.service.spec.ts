import { TestBed } from '@angular/core/testing';

import { InfinityTokenService } from './infinity-token.service';

describe('InfinityTokenService', () => {
  let service: InfinityTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfinityTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

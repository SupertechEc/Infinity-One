import { TestBed } from '@angular/core/testing';

import { ConectionFirebaseService } from './conection-firebase.service';

describe('ConectionFirebaseService', () => {
  let service: ConectionFirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConectionFirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

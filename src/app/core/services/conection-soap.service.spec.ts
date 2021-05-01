import { TestBed } from '@angular/core/testing';

import { ConectionSoapService } from './conection-soap.service';

describe('ConectionSoapService', () => {
  let service: ConectionSoapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConectionSoapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ClaveAccesoService } from './clave-acceso.service';

describe('ClaveAccesoService', () => {
  let service: ClaveAccesoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClaveAccesoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

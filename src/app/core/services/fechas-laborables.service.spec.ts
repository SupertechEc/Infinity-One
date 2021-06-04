import { TestBed } from '@angular/core/testing';

import { FechasLaborablesService } from './fechas-laborables.service';

describe('FechasLaborablesService', () => {
  let service: FechasLaborablesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FechasLaborablesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

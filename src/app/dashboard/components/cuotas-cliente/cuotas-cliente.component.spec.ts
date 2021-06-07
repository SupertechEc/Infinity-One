import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuotasClienteComponent } from './cuotas-cliente.component';

describe('CuotasClienteComponent', () => {
  let component: CuotasClienteComponent;
  let fixture: ComponentFixture<CuotasClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuotasClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuotasClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

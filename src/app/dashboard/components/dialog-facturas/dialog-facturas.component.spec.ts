import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFacturasComponent } from './dialog-facturas.component';

describe('DialogFacturasComponent', () => {
  let component: DialogFacturasComponent;
  let fixture: ComponentFixture<DialogFacturasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogFacturasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogFacturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

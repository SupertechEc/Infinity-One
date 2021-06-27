import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteproductoComponent } from './clienteproducto.component';

describe('ClienteproductoComponent', () => {
  let component: ClienteproductoComponent;
  let fixture: ComponentFixture<ClienteproductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClienteproductoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteproductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

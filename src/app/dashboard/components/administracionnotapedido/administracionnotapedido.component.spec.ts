import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionnotapedidoComponent } from './administracionnotapedido.component';

describe('AdministracionnotapedidoComponent', () => {
  let component: AdministracionnotapedidoComponent;
  let fixture: ComponentFixture<AdministracionnotapedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministracionnotapedidoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracionnotapedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

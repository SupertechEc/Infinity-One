import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotapedidoComponent } from './notapedido.component';

describe('NotapedidoComponent', () => {
  let component: NotapedidoComponent;
  let fixture: ComponentFixture<NotapedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotapedidoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotapedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

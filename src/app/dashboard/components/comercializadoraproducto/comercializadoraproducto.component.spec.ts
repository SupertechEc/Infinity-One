import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComercializadoraproductoComponent } from './comercializadoraproducto.component';

describe('ComercializadoraproductoComponent', () => {
  let component: ComercializadoraproductoComponent;
  let fixture: ComponentFixture<ComercializadoraproductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComercializadoraproductoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComercializadoraproductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

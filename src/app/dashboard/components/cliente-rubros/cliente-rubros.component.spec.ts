import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteRubrosComponent } from './cliente-rubros.component';

describe('ClienteRubrosComponent', () => {
  let component: ClienteRubrosComponent;
  let fixture: ComponentFixture<ClienteRubrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClienteRubrosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteRubrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

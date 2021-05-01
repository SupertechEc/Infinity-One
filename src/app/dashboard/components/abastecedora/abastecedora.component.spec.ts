import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbastecedoraComponent } from './abastecedora.component';

describe('AbastecedoraComponent', () => {
  let component: AbastecedoraComponent;
  let fixture: ComponentFixture<AbastecedoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbastecedoraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbastecedoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

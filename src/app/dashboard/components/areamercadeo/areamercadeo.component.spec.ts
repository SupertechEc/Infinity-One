import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreamercadeoComponent } from './areamercadeo.component';

describe('AreamercadeoComponent', () => {
  let component: AreamercadeoComponent;
  let fixture: ComponentFixture<AreamercadeoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreamercadeoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AreamercadeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

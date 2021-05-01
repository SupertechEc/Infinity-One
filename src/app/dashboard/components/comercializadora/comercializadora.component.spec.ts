import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComercializadoraComponent } from './comercializadora.component';

describe('ComercializadoraComponent', () => {
  let component: ComercializadoraComponent;
  let fixture: ComponentFixture<ComercializadoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComercializadoraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComercializadoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

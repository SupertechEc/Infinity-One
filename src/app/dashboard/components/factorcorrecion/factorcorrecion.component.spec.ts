import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactorcorrecionComponent } from './factorcorrecion.component';

describe('FactorcorrecionComponent', () => {
  let component: FactorcorrecionComponent;
  let fixture: ComponentFixture<FactorcorrecionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FactorcorrecionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FactorcorrecionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

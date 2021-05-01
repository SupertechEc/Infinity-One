import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DireccioninenComponent } from './direccioninen.component';

describe('DireccioninenComponent', () => {
  let component: DireccioninenComponent;
  let fixture: ComponentFixture<DireccioninenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DireccioninenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DireccioninenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

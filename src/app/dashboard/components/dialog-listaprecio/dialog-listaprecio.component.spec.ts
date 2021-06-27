import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogListaprecioComponent } from './dialog-listaprecio.component';

describe('DialogListaprecioComponent', () => {
  let component: DialogListaprecioComponent;
  let fixture: ComponentFixture<DialogListaprecioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogListaprecioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogListaprecioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

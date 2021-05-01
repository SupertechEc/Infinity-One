import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaprecioterminalproductoComponent } from './listaprecioterminalproducto.component';

describe('ListaprecioterminalproductoComponent', () => {
  let component: ListaprecioterminalproductoComponent;
  let fixture: ComponentFixture<ListaprecioterminalproductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaprecioterminalproductoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaprecioterminalproductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsPreciosComponent } from './details-precios.component';

describe('DetailsPreciosComponent', () => {
  let component: DetailsPreciosComponent;
  let fixture: ComponentFixture<DetailsPreciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsPreciosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsPreciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

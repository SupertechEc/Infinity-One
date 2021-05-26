import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GravamenComponent } from './gravamen.component';

describe('GravamenComponent', () => {
  let component: GravamenComponent;
  let fixture: ComponentFixture<GravamenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GravamenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GravamenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

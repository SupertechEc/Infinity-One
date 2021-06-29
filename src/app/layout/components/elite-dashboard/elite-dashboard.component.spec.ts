import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliteDashboardComponent } from './elite-dashboard.component';

describe('EliteDashboardComponent', () => {
  let component: EliteDashboardComponent;
  let fixture: ComponentFixture<EliteDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EliteDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EliteDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

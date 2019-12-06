import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoLinearComponent } from './grafico-linear.component';

describe('GraficoLinearComponent', () => {
  let component: GraficoLinearComponent;
  let fixture: ComponentFixture<GraficoLinearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraficoLinearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraficoLinearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

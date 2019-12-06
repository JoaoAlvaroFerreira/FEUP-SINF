import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoBoloComponent } from './grafico-bolo.component';

describe('GraficoBoloComponent', () => {
  let component: GraficoBoloComponent;
  let fixture: ComponentFixture<GraficoBoloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraficoBoloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraficoBoloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

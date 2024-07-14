import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoRetoComponent } from './resultado-reto.component';

describe('ResultadoRetoComponent', () => {
  let component: ResultadoRetoComponent;
  let fixture: ComponentFixture<ResultadoRetoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultadoRetoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultadoRetoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

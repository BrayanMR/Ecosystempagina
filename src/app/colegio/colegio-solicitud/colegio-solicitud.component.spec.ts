import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColegioSolicitudComponent } from './colegio-solicitud.component';

describe('ColegioSolicitudComponent', () => {
  let component: ColegioSolicitudComponent;
  let fixture: ComponentFixture<ColegioSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColegioSolicitudComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ColegioSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

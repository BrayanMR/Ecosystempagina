import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesorSolicitudComponent } from './profesor-solicitud.component';

describe('ProfesorSolicitudComponent', () => {
  let component: ProfesorSolicitudComponent;
  let fixture: ComponentFixture<ProfesorSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfesorSolicitudComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfesorSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

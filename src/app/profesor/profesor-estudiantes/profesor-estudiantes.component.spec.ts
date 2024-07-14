import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesorEstudiantesComponent } from './profesor-estudiantes.component';

describe('ProfesorEstudiantesComponent', () => {
  let component: ProfesorEstudiantesComponent;
  let fixture: ComponentFixture<ProfesorEstudiantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfesorEstudiantesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfesorEstudiantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

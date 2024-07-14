import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColegioProfesoresComponent } from './colegio-profesores.component';

describe('ColegioProfesoresComponent', () => {
  let component: ColegioProfesoresComponent;
  let fixture: ComponentFixture<ColegioProfesoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColegioProfesoresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ColegioProfesoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColegioNavbarComponent } from './colegio-navbar.component';

describe('ColegioNavbarComponent', () => {
  let component: ColegioNavbarComponent;
  let fixture: ComponentFixture<ColegioNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColegioNavbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ColegioNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

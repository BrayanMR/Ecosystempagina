import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesorRetoComponent } from './profesor-reto.component';

describe('ProfesorRetoComponent', () => {
  let component: ProfesorRetoComponent;
  let fixture: ComponentFixture<ProfesorRetoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfesorRetoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfesorRetoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

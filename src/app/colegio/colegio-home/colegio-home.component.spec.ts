import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColegioHomeComponent } from './colegio-home.component';

describe('ColegioHomeComponent', () => {
  let component: ColegioHomeComponent;
  let fixture: ComponentFixture<ColegioHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColegioHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ColegioHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

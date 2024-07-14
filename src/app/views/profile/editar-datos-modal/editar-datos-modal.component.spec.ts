import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarDatosModalComponent } from './editar-datos-modal.component';

describe('EditarDatosModalComponent', () => {
  let component: EditarDatosModalComponent;
  let fixture: ComponentFixture<EditarDatosModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarDatosModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarDatosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

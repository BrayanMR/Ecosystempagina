import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-editar-datos-modal',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './editar-datos-modal.component.html',
  styleUrl: './editar-datos-modal.component.css'
})
export class EditarDatosModalComponent {
  @Input() currentPage: string;
  constructor() { }
  
  showModal: boolean = false;

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

}

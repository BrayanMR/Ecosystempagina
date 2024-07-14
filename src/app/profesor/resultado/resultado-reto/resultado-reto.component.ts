import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-resultado-reto',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './resultado-reto.component.html',
  styleUrls: ['./resultado-reto.component.css']
})
export class ResultadoRetoComponent {
  @Input() resultado: 'ganador' | 'empate' | 'ninguno' = 'ninguno';
  @Input() ganador: any = null;
  mensaje: string = '';

  ngOnInit(): void {
    this.setMensaje();
  }

  setMensaje(): void {
    switch (this.resultado) {
      case 'ganador':
        this.mensaje = `¡Felicidades ${this.ganador.name}! Has ganado el reto con ${this.ganador.hearts} corazones.`;
        break;
      case 'empate':
        this.mensaje = '¡Es un empate! Buen trabajo a todos los participantes.';
        break;
      case 'ninguno':
        this.mensaje = 'Nadie participó en el reto.';
        break;
      default:
        this.mensaje = '';
    }
  }
}

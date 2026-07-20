import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-quienes-somos',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './quienes-somos.component.html',
  styleUrls: ['./quienes-somos.component.css']
})
export class QuienesSomosComponent {
  logoUrl: string = 'https://firebasestorage.googleapis.com/v0/b/ecosystems-f5e54.appspot.com/o/imagen%2Flogo.png?alt=media&token=1b69e0f3-f6fb-4da6-9e62-cb0f617ef410';

  // Valores de la plataforma. Edita estos textos con la información real.
  valores = [
    {
      icon: '🎓',
      titulo: 'Aprendizaje real',
      descripcion: 'Conectamos lo que se enseña en el aula con retos auténticos que los estudiantes pueden resolver.'
    },
    {
      icon: '🤝',
      titulo: 'Colaboración',
      descripcion: 'Profesores, estudiantes y colegios trabajan juntos en una misma comunidad educativa.'
    },
    {
      icon: '🌱',
      titulo: 'Crecimiento',
      descripcion: 'Cada reto superado deja una evidencia visible del progreso del estudiante.'
    },
    {
      icon: '🔒',
      titulo: 'Seguridad',
      descripcion: 'Validamos identidades y certificados para mantener una comunidad confiable.'
    }
  ];

  equipo = [
    { nombre: 'Nombre Apellido', rol: 'Dirección', initials: 'NA' },
    { nombre: 'Nombre Apellido', rol: 'Desarrollo', initials: 'NA' },
    { nombre: 'Nombre Apellido', rol: 'Diseño', initials: 'NA' }
  ];
}

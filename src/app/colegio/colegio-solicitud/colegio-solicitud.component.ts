import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../auth/auth.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { ColegioNavbarComponent } from '../colegio-navbar/colegio-navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-colegio-solicitud',
  standalone: true,
  imports: [ColegioNavbarComponent, CommonModule, FormsModule],
  templateUrl: './colegio-solicitud.component.html',
  styleUrls: ['./colegio-solicitud.component.css']
})
export class ColegioSolicitudComponent implements OnInit {
  profesores$: Observable<any[]>; // Observable de profesores pendientes de aprobación
  institucion: string | undefined;
  profesorId: string | undefined;

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  ngOnInit(): void {
    this.authService.obtenerUsuarioActual().subscribe(user => {
      if (user && user.institucion) {
        this.institucion = user.institucion;
        this.cargarProfesores(this.institucion);
      }
    });
  }

  cargarProfesores(institucion: string) {
    this.profesores$ = this.firestore.collection('usuarios', ref => 
      ref.where('institucion', '==', institucion)
         .where('role', '==', 'profesor')
         .where('approved', '==', false)
    ).valueChanges({ idField: 'id' });
  }

  toggleInput(inputId: string) {
    const inputEstudiantes = document.getElementById('input-estudiantes');
    const inputCursos = document.getElementById('input-cursos');
    
    if (inputId === 'estudiantes' && inputEstudiantes) {
      inputEstudiantes.classList.toggle('hidden');
      if (inputCursos && !inputCursos.classList.contains('hidden')) {
        inputCursos.classList.add('hidden');
      }
    } else if (inputId === 'cursos' && inputCursos) {
      inputCursos.classList.toggle('hidden');
      if (inputEstudiantes && !inputEstudiantes.classList.contains('hidden')) {
        inputEstudiantes.classList.add('hidden');
      }
    }
  }

  toggleModal(modalId: string, pdfUrl?: string, profesorId?: string) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.toggle('hidden');
      if (modalId === 'documentModal') {
        const iframe = document.getElementById('document-iframe') as HTMLIFrameElement;
        if (iframe) {
          iframe.src = pdfUrl || '';
        }
        this.profesorId = profesorId;
      }
    }
  }

  approveProfesor(profesorId?: string): void {
    const id = profesorId || this.profesorId;
    if (id) {
      this.firestore.collection('usuarios').doc(id).update({ approved: true });
      this.toggleModal('documentModal');
    }
  }

  denyProfesor(profesorId?: string): void {
    const id = profesorId || this.profesorId;
    if (id) {
      this.firestore.collection('usuarios').doc(id).delete();
      this.toggleModal('documentModal');
    }
  }
}

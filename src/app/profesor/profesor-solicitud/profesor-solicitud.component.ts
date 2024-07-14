import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../../auth/auth.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { ProfesornavbarComponent } from '../profesornavbar/profesornavbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profesor-solicitud',
  standalone: true,
  imports: [ProfesornavbarComponent, CommonModule, FormsModule],
  templateUrl: './profesor-solicitud.component.html',
  styleUrls: ['./profesor-solicitud.component.css']
})
export class ProfesorSolicitudComponent implements OnInit {
  estudiantes$: Observable<any[]>; // Observable de estudiantes
  selectedEstudiante: any;
  institucion: string | undefined;
  curso: string | undefined;

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private storage: AngularFireStorage
  ) {}

  ngOnInit(): void {
    this.authService.obtenerUsuarioActual().subscribe(user => {
      if (user && user.institucion && user.curso) {
        this.institucion = user.institucion;
        this.curso = user.curso;
        this.cargarEstudiantes(this.institucion, this.curso);
      }
    });
  }

  cargarEstudiantes(institucion: string, curso: string) {
    this.estudiantes$ = this.firestore.collection('usuarios', ref => 
      ref.where('institucion', '==', institucion)
         .where('curso', '==', curso)
         .where('role', '==', 'estudiante')
         .where('approved', '==', false)
    ).valueChanges({ idField: 'id' });
  }

  toggleModal(modalId: string, estudiante?: any): void {
    const modal = document.getElementById(modalId);
    const iframe = document.getElementById('document-iframe') as HTMLIFrameElement;

    if (estudiante) {
      this.selectedEstudiante = estudiante;
      iframe.src = estudiante.certificateUrl || '';
    }

    modal?.classList.toggle('hidden');
  }

  approveEstudiante(): void {
    if (this.selectedEstudiante) {
      this.firestore.collection('usuarios').doc(this.selectedEstudiante.id).update({ approved: true });
      this.toggleModal('documentModal');
    }
  }

  denyEstudiante(): void {
    if (this.selectedEstudiante) {
      const userId = this.selectedEstudiante.id;
      this.firestore.collection('usuarios').doc(userId).delete().then(() => {
        this.authService.deleteUser(userId); // Correctly calling deleteUser on AuthService
        this.toggleModal('documentModal');
      });
    }
  }
}

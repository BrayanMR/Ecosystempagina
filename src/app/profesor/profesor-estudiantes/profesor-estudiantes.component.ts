import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProfesornavbarComponent } from '../profesornavbar/profesornavbar.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-profesor-estudiantes',
  standalone: true,
  imports: [CommonModule, ProfesornavbarComponent, RouterModule, FormsModule],
  templateUrl: './profesor-estudiantes.component.html',
  styleUrls: ['./profesor-estudiantes.component.css']
})
export class ProfesorEstudiantesComponent implements OnInit {
  estudiantes$: Observable<any[]>; // Observable de estudiantes
  institucion: string | undefined;
  curso: string | undefined;
  selectedEstudiante: any = { name: '', lastname: '', identificacion: '', email: '', curso: '', photoUrl: '' }; // Inicializar con un objeto vacío
  uploadProgress$: Observable<number> | undefined; // Observable para el progreso de la carga

  constructor(private authService: AuthService, private firestore: AngularFirestore, private storage: AngularFireStorage) {}

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
    this.estudiantes$ = this.firestore.collection('usuarios', ref => ref.where('institucion', '==', institucion).where('curso', '==', curso).where('role', '==', 'estudiante'))
      .valueChanges({ idField: 'id' }); // Incluir el id de los documentos
  }

  openModal(estudiante: any = null) {
    if (estudiante) {
      this.selectedEstudiante = { ...estudiante }; // Clonar el objeto para evitar mutaciones no deseadas
    } else {
      this.selectedEstudiante = { name: '', lastname: '', identificacion: '', email: '', curso: '', photoUrl: '' }; // Restablecer el formulario
    }
    const modal = document.getElementById('modal');
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

  closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  handleFileInput(event: any) {
    const file = event.target.files[0];
    if (file) {
      const filePath = `profiles/${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, file);

      this.uploadProgress$ = uploadTask.percentageChanges();

      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            this.selectedEstudiante.photoUrl = url; // Asignar el URL de la imagen cargada
          });
        })
      ).subscribe();
    }
  }

  saveChanges() {
    if (this.selectedEstudiante.id) {
      this.firestore.collection('usuarios').doc(this.selectedEstudiante.id).update(this.selectedEstudiante)
        .then(() => {
          this.closeModal();
        });
    }
  }

  deleteEstudiante(estudiante: any) {
    this.firestore.collection('usuarios').doc(estudiante.id).delete()
      .then(() => {
        // Opcional: cualquier lógica adicional después de la eliminación
      });
  }
}

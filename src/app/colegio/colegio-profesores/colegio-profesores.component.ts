import { Component, OnInit } from '@angular/core';
import { ColegioNavbarComponent } from '../colegio-navbar/colegio-navbar.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage'; // Importar AngularFireStorage
import { finalize } from 'rxjs/operators'; // Importar finalize

@Component({
  selector: 'app-colegio-profesores',
  standalone: true,
  imports: [ColegioNavbarComponent, CommonModule, RouterModule,FormsModule],
  templateUrl: './colegio-profesores.component.html',
  styleUrls: ['./colegio-profesores.component.css']
})
export class ColegioProfesoresComponent implements OnInit {
  profesores$: Observable<any[]>; // Observable de profesores
  institucion: string | undefined;
  selectedProfesor: any = { name: '', lastname: '', identificacion: '', email: '' }; // Inicializar con un objeto vacío
  uploadProgress$: Observable<number> | undefined; // Observable para el progreso de la carga

  constructor(private authService: AuthService, private firestore: AngularFirestore, private storage: AngularFireStorage) {}

  ngOnInit(): void {
    this.authService.obtenerUsuarioActual().subscribe(user => {
      if (user && user.institucion) {
        this.institucion = user.institucion;
        this.cargarProfesores(this.institucion);
      }
    });
  }

  cargarProfesores(institucion: string) {
    this.profesores$ = this.firestore.collection('usuarios', ref => ref.where('institucion', '==', institucion).where('role', '==', 'profesor'))
      .valueChanges({ idField: 'id' }); // Incluir el id de los documentos
  }

  openModal(profesor: any = null) {
    if (profesor) {
      this.selectedProfesor = { ...profesor }; // Clonar el objeto para evitar mutaciones no deseadas
    } else {
      this.selectedProfesor = { name: '', lastname: '', identificacion: '', email: '' }; // Restablecer el formulario
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
            this.selectedProfesor.photoUrl = url; // Asignar el URL de la imagen cargada
          });
        })
      ).subscribe();
    }
  }

  saveChanges() {
    if (this.selectedProfesor.id) {
      this.firestore.collection('usuarios').doc(this.selectedProfesor.id).update(this.selectedProfesor)
        .then(() => {
          this.closeModal();
        });
    }
  }

  deleteProfesor(profesor: any) {
    this.firestore.collection('usuarios').doc(profesor.id).delete()
      .then(() => {
        // Opcional: cualquier lógica adicional después de la eliminación
      });
  }
}
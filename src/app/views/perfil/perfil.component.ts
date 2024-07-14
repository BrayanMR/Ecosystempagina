
import { Navbar2Component } from '../navbar2/navbar2.component';
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';


// Inicializa Firebase

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule,Navbar2Component],
})
export class PerfilComponent implements OnInit {
  selectedFile: File | null = null;
  photoUrl: string | null = null;
  isModalOpen: boolean = false;
  usuarioActual: any={};

  constructor(private authService: AuthService) {}

  
  ngOnInit(): void {

    // Inicializa usuarioActual desde el servicio de autenticación
    this.authService.obtenerUsuarioActual().subscribe(user => {
      this.usuarioActual = user;
      if (user && user.photoUrl) {
        this.photoUrl = user.photoUrl;
      }
    });
  }
  openEditModal() {
    this.isModalOpen = true;
    document.getElementById('editModal')?.classList.add('show');
  }

  closeEditModal() {
    this.isModalOpen = false;
    document.getElementById('editModal')?.classList.remove('show');
  }

  saveChanges() {
    this.isModalOpen = false;
    document.getElementById('editModal')?.classList.remove('show');
    alert('Cambios guardados!');
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async uploadFile() {
    if (this.selectedFile && this.usuarioActual && this.usuarioActual.uid) {
      const storage = getStorage();
      const fileExtension = this.selectedFile.name.split('.').pop();
      const newFileName = `${this.usuarioActual.uid}.${fileExtension}`;
      const storageRef = ref(storage, `uploads/${newFileName}`);
      try {
        await uploadBytes(storageRef, this.selectedFile);
        this.photoUrl = await getDownloadURL(storageRef);
        console.log('File available at', this.photoUrl);

        // Actualizar la URL de la imagen en la base de datos del usuario
        this.usuarioActual.photoUrl = this.photoUrl;
        await this.authService.actualizarUsuario(this.usuarioActual.uid, { photoUrl: this.photoUrl });
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  }

  async actualizarUsuario(usuario: any) {
    if (this.usuarioActual && this.usuarioActual.uid) {
      try {
        await this.authService.actualizarUsuario(this.usuarioActual.uid, usuario);
        console.log('Usuario actualizado con éxito');
      } catch (error) {
        console.error('Error actualizando usuario:', error);
      }
    }
  }
}
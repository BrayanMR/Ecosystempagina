import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from './user.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  
  
  toggleContainer() {
    const container = document.getElementById('container');
    container?.classList.toggle('right-panel-active');
  }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  registerForm = new FormGroup({
    name: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    curso: new FormControl('', Validators.required),
    identificacion: new FormControl('', Validators.required),
    institucion: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
    certificate: new FormControl(null, Validators.required),
    photo: new FormControl(null, Validators.required)
  });

  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private 

  async loginSubmit() {
    if (this.loginForm.valid) {
      try {
        const user = this.loginForm.value as User;
        await this.authService.signIn(user);
        console.log('Inicio de sesión exitoso');
        
        Swal.fire({
          icon: 'success',
          title: 'Inicio de sesión exitoso!',
          showConfirmButton: false,
          timer: 700
        });
      } catch (error: any) {
        
        console.error(error);
        let errorMessage = 'Error de inicio de sesión!';
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage, // Usa la variable errorMessage que ya tienes
          showConfirmButton: true,
          confirmButtonText: 'Cerrar'
        });
        if (error.message === 'User not approved') {
          
          errorMessage = 'Usuario no aprobado!';
        } else if (error.message === 'auth/wrong-password') {
          errorMessage = 'La contraseña es incorrecta!';
        } else if (error.message === 'auth/user-not-found') {
          errorMessage = 'Usuario no encontrado!';
        }
        Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage, // Usa la variable errorMessage que ya tienes
        showConfirmButton: true,
        confirmButtonText: 'Cerrar'
      })
 
      }
    } else {
      this.snackBar.open('Por favor, completa todos los campos correctamente.', 'Cerrar', { duration: 3000 });
    }
  }

  async registerSubmit() {
    if (this.registerForm.valid) {
      try {
        const newUser = this.registerForm.value as User;
        const photoFile = this.registerForm.get('photo')!.value as File;
        const certificateFile = this.registerForm.get('certificate')!.value as File;
        await this.authService.signUp(newUser, photoFile, certificateFile);
        console.log('Registro exitoso');
        this.snackBar.open('Registro exitoso!', 'Cerrar', { duration: 3000 });
      } catch (error: any) {
        console.error('Error al registrar usuario:', error);
        let errorMessage = 'Error al registrar usuario!';
        if (error.message === 'auth/email-already-in-use') {
          errorMessage = 'El correo ya está en uso!';
        }
        this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
      }
    } else {
      this.snackBar.open('Por favor, completa todos los campos correctamente.', 'Cerrar', { duration: 3000 });
    }
  }

  cargarImagen(event: any, type: 'photo' | 'certificate') {
    const file = event.target.files[0] as File;
    this.registerForm.patchValue({ [type]: file });
  }
}

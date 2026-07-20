import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, AfterViewInit, inject, PLATFORM_ID, ViewChild } from '@angular/core';
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
export class AuthComponent implements AfterViewInit {

  @ViewChild('bgVideo') bgVideo!: ElementRef<HTMLVideoElement>;

  private platformId = inject(PLATFORM_ID);

  ngAfterViewInit() {
    // El video solo existe en el navegador. Durante el SSR no hay DOM real
    // y nativeElement no tiene .play(), así que saltamos todo este bloque
    // cuando estamos renderizando en el servidor.
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Forzamos la reproducción del video de fondo.
    // El autoplay a veces no se respeta en Angular (SPA), por eso lo
    // disparamos manualmente desde aquí tras el render del DOM.
    const video = this.bgVideo?.nativeElement;
    if (video) {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Si el navegador bloquea el autoplay, reintentamos al primer
          // clic/tecla del usuario (política de autoplay de Chrome).
          const resume = () => {
            video.play().catch(() => {});
            window.removeEventListener('click', resume);
            window.removeEventListener('keydown', resume);
          };
          window.addEventListener('click', resume, { once: true });
          window.addEventListener('keydown', resume, { once: true });
        });
      }
    }
  }

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
        if (error.message === 'User not approved') {
          errorMessage = 'Usuario no aprobado!';
        } else if (error.code === 'auth/wrong-password' || error.message === 'auth/wrong-password') {
          errorMessage = 'La contraseña es incorrecta!';
        } else if (error.code === 'auth/user-not-found' || error.message === 'auth/user-not-found') {
          errorMessage = 'Usuario no encontrado!';
        }
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
          showConfirmButton: true,
          confirmButtonText: 'Cerrar'
        });
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

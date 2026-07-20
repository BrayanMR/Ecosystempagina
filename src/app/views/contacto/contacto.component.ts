import { Component, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, NavbarComponent],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private platformId = inject(PLATFORM_ID);

  enviado = false;

  // Datos de contacto de ejemplo. Edita con los datos reales.
  contactoInfo = [
    { icon: '📧', label: 'Email', valor: 'contacto@eco-system.com' },
    { icon: '📞', label: 'Teléfono', valor: '+57 300 000 0000' },
    { icon: '📍', label: 'Ubicación', valor: 'Colombia' }
  ];

  redes = [
    { nombre: 'Facebook', icon: 'f', url: '#' },
    { nombre: 'Instagram', icon: 'i', url: '#' },
    { nombre: 'Twitter / X', icon: 'X', url: '#' }
  ];

  form: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    asunto: ['', [Validators.required]],
    mensaje: ['', [Validators.required, Validators.minLength(10)]]
  });

  enviar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snackBar.open('Por favor completa todos los campos correctamente.', 'Cerrar', { duration: 3000 });
      return;
    }

    // TODO: aquí conectarías el formulario con tu backend / Firestore /
    // servicio de email (EmailJS, SendGrid, etc.). Por ahora solo simulamos.
    console.log('Mensaje de contacto:', this.form.value);
    this.enviado = true;
    this.snackBar.open('¡Mensaje enviado! Te responderemos pronto.', 'Cerrar', { duration: 4000 });
    this.form.reset();
    // El platformId no es estrictamente necesario aquí (el form es interactivo),
    // pero evita cualquier parpadeo durante la hidratación del SSR.
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => (this.enviado = false), 5000);
    }
  }

  // Helpers para mostrar errores en la plantilla
  esInvalido(campo: string): boolean {
    const c = this.form.get(campo);
    return !!c && c.invalid && (c.dirty || c.touched);
  }
}

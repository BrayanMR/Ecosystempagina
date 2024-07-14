import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

interface Publicacion {
  id?: string;
  contenido: string;
  autorId: string;
  autorNombre: string;
  fecha: Date;
  imagenUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PublicacionService {
  firestore = inject(AngularFirestore);
  authService = inject(AuthService);

  constructor() {}

  obtenerPublicaciones(): Observable<Publicacion[]> {
    return this.firestore.collection<Publicacion>('publicaciones', ref => ref.orderBy('fecha', 'desc')).valueChanges({ idField: 'id' });
  }

  crearPublicacion(publicacion: Publicacion): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.collection('publicaciones').doc(id).set({ ...publicacion, id });
  }

  actualizarPublicacion(id: string, data: Partial<Publicacion>): Promise<void> {
    return this.firestore.collection('publicaciones').doc(id).update(data);
  }

  eliminarPublicacion(id: string): Promise<void> {
    return this.firestore.collection('publicaciones').doc(id).delete();
  }
}

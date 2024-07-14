import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Reto } from './reto.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RetoService {
  constructor(private firestore: AngularFirestore) {}

  obtenerRetos(): Observable<Reto[]> {
    return this.firestore.collection('retos').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Reto;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  crearReto(reto: Reto, curso: string): Promise<any> {
    const id = this.firestore.createId();
    reto.tiempoRestante = reto.cronometro * 60;
    return this.firestore.doc<Reto>(`retos/${id}`).set({ ...reto, id });
  }

  eliminarReto(id: string): Promise<void> {
    return this.firestore.doc<Reto>(`retos/${id}`).delete();
  }

  finalizarReto(retoId: string): Promise<void> {
    return this.firestore.collection('retos').doc(retoId).update({ activo: false });
  }


  obtenerEstudiantesParticipando(curso: string): Observable<any[]> {
    return this.firestore.collection('usuarios', ref => ref.where('role', '==', 'estudiante').where('curso', '==', curso)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  actualizarTiempoRestante(retoId: string, tiempoRestante: number): Promise<void> {
    return this.firestore.collection('retos').doc(retoId).update({ tiempoRestante });
  }

  actualizarPuntosEstudiante(studentId: string, puntos: number): Promise<void> {
    return this.firestore.collection('usuarios').doc(studentId).update({ points: puntos });
  }
}
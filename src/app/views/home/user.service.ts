import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reto } from '../../profesor/profesor-reto/reto.model';
import { getFirestore, arrayUnion, FieldValue } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: AngularFirestore) {}

  getFriends(): Observable<any[]> {
    return this.firestore.collection('friends').valueChanges();
  }

  getUserByEmail(email: string): Observable<any> {
    return this.firestore.collection('users', ref => ref.where('email', '==', email)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  
  getUserById(userId: string): Observable<any> {
    return this.firestore.collection('users').doc(userId).valueChanges();
  }

  sendFriendRequest(userId: string, friendEmail: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.getUserByEmail(friendEmail).subscribe(users => {
        if (users.length === 0) {
          reject('El correo electrónico no está registrado.');
          return;
        }

        const friendId = users[0].id;
        this.firestore.collection('friendRequests').add({
          from: userId,
          to: friendId,
          status: 'pending'
        }).then(() => resolve()).catch(error => reject(error));
      });
    });
  }

  obtenerRetos(): Observable<Reto[]> {
    return this.firestore.collection('retos').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Reto;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  crearReto(reto: Reto): Promise<void> {
    const id = this.firestore.createId();
    reto.tiempoRestante = reto.cronometro * 60; // Convertir a segundos
    return this.firestore.doc<Reto>(`retos/${id}`).set({ ...reto, id });
  }

  eliminarReto(id: string): Promise<void> {
    return this.firestore.doc<Reto>(`retos/${id}`).delete();
  }

  unirseAlReto(retoId: string, studentId: string): Promise<void> {
    return this.firestore.collection('retos').doc(retoId).collection('participantes').doc(studentId).set({ points: 0 });
  }

  finalizarReto(retoId: string): Promise<void> {
    return this.firestore.collection('retos').doc(retoId).update({ activo: false });
  }

  obtenerEstudiantesParticipando(retoId: string): Observable<any[]> {
    return this.firestore.collection('retos').doc(retoId).collection('participantes').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  obtenerUsuario(userId: string): Observable<any> {
    return this.firestore.collection('usuarios').doc(userId).snapshotChanges().pipe(
      map(action => {
        const data = action.payload.data() as any;
        return { id: action.payload.id, ...data };
      })
    );
  }

  actualizarPuntosYRetos(userId: string, nuevosPuntos: number, retoId: string): Promise<void> {
    return this.firestore.collection('usuarios').doc(userId).update({
      points: nuevosPuntos,
      retosCompletados: arrayUnion(retoId)
    });
  }

  actualizarTiempoRestante(retoId: string, tiempoRestante: number): Promise<void> {
    return this.firestore.collection('retos').doc(retoId).update({ tiempoRestante });
  }
}

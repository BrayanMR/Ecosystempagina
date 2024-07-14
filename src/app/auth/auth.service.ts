import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { User } from './user.model';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';

interface UserDocument {
  approved: boolean;
  role: 'estudiante' | 'profesor' | 'colegio';
  points: number; // Agregar campo de puntos
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  storage = inject(AngularFireStorage);
  router = inject(Router);

  constructor() {}

  async signIn(user: User) {
    const { user: loggedInUser } = await signInWithEmailAndPassword(getAuth(), user.email, user.password);
    const userDoc = await this.firestore.collection('usuarios').doc(loggedInUser.uid).get().toPromise();

    if (userDoc.exists) {
      const userData = userDoc.data() as UserDocument;

      if (!userData.approved) {
        await this.signOut();
        throw new Error('User not approved');
      }

      switch (userData.role) {
        case 'estudiante':
          this.router.navigateByUrl('/home', { replaceUrl: true });
          break;
        case 'profesor':
          this.router.navigateByUrl('/profesorHome', { replaceUrl: true });
          break;
        case 'colegio':
          this.router.navigateByUrl('/homeColegio', { replaceUrl: true });
          break;
        default:
          throw new Error('Rol desconocido');
      }
    } else {
      await this.signOut();
      throw new Error('User document not found');
    }
  }

  signOut() {
    return this.auth.signOut().then(() => {
      this.router.navigateByUrl('/auth', { replaceUrl: true });
    });
  }

  async signUp(user: User, photoFile: File, certificateFile: File) {
    const { user: newUser } = await createUserWithEmailAndPassword(getAuth(), user.email, user.password);
    await updateProfile(newUser, { displayName: `${user.name} ${user.lastname}` });

    const photoUrl = await this.uploadFile(photoFile, `profile_photos/${newUser.uid}`);
    const certificateUrl = await this.uploadFile(certificateFile, `certificates/${newUser.uid}`);

    return this.firestore.collection('usuarios').doc(newUser.uid).set({
      uid: newUser.uid,
      name: user.name,
      lastname: user.lastname,
      identificacion: user.identificacion,
      institucion: user.institucion,
      curso:user.curso,
      email: user.email,
      role: user.role,
      approved: false,
      points: 0 ,
      photoUrl,
      certificateUrl
    });
  }

  obtenerUsuarioActual(): Observable<any> {
    return this.auth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.collection('usuarios').doc(user.uid).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  actualizarUsuario(uid: string, usuario: any) {
    return this.firestore.collection('usuarios').doc(uid).update(usuario);
  }

  obtenerLogoUrl(): Observable<any> {
    return this.firestore.collection('config').doc('logo').valueChanges();
  }

  getFriends(): Observable<any[]> {
    return this.firestore.collection('friends').valueChanges();
  }

  getToken(): Observable<string | null> {
    return this.auth.idToken;
  }

  obtenerRolUsuarioActual(): Observable<'estudiante' | 'profesor' | 'colegio' | null> {
    return this.auth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.collection('usuarios').doc(user.uid).valueChanges().pipe(
            map((userData: any) => userData.role as 'estudiante' | 'profesor' | 'colegio')
          );
        } else {
          return of(null);
        }
      })
    );
  }

  async uploadFile(file: File, path: string): Promise<string> {
    const fileRef = this.storage.ref(path);
    await this.storage.upload(path, file);
    return fileRef.getDownloadURL().toPromise();
  }

  updateUser(uid: string, data: Partial<User>) {
    return this.firestore.collection('usuarios').doc(uid).update(data);
  }

  deleteUser(uid: string) {
    return this.firestore.collection('usuarios').doc(uid).delete();
  }
  
  async updateStudentPoints(uid: string, points: number) {
    const userDoc = await this.firestore.collection('usuarios').doc(uid).get().toPromise();
    if (userDoc.exists) {
      const currentPoints = (userDoc.data() as UserDocument).points || 0;
      await this.firestore.collection('usuarios').doc(uid).update({ points: currentPoints + points });
    } else {
      throw new Error('User document not found');
    }
  }
  async addPoints(uid: string, points: number) {
    try {
      await this.updateStudentPoints(uid, points);
      console.log('Puntos actualizados exitosamente');
    } catch (error) {
      console.error('Error al actualizar los puntos:', error);
    }
  }
  
}

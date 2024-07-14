import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Post } from './post.model';
import firebase from 'firebase/compat/app';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(private firestore: AngularFirestore) {}

  getPosts(): Observable<Post[]> {
    return this.firestore.collection<Post>('posts').valueChanges({ idField: 'id' });
  }

  addPost(post: Post): Promise<void> {
    const id = this.firestore.createId();
    post.id = id;
    return this.firestore.doc<Post>(`posts/${id}`).set(post);
  }

  crearPublicacion(publicacion: any): Promise<void> {
    const id = this.firestore.createId();
    publicacion.id = id;
    return this.firestore.collection('posts').doc(id).set(publicacion);
  }

  removeHeart(postId: string, userId: string): Promise<void> {
    return this.firestore.collection('posts').doc(postId).update({
      [`hearts.${userId}`]: firebase.firestore.FieldValue.delete()
    });
  }

  giveHeart(postId: string, userId: string): Promise<void> {
    return this.firestore.collection('posts').doc(postId).update({
      [`hearts.${userId}`]: true
    });
  }

  deletePost(postId: string): Promise<void> {
    return this.firestore.doc<Post>(`posts/${postId}`).delete();
  }

  getHeartsCount(hearts: Record<string, any> | null | undefined): number {
    return Object.keys(hearts ?? {}).length;
  }

  getPostsByChallengeId(challengeId: string): Observable<any[]> {
    return this.firestore.collection('posts', ref => ref.where('challengeId', '==', challengeId))
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }
}

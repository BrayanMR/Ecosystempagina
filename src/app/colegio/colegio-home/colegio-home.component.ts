import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { ColegioNavbarComponent } from '../colegio-navbar/colegio-navbar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PostService } from '../../views/home/post.service';
import { UserService } from '../../views/home/user.service';
import { Post } from '../../views/home/post.model';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { user } from '@angular/fire/auth';


@Component({
  standalone: true,
  imports: [ColegioNavbarComponent, CommonModule, FormsModule],
  selector: 'app-colegio-home',
  templateUrl: './colegio-home.component.html',
  styleUrls: ['./colegio-home.component.css']
})
export class ColegioHomeComponent implements OnInit {
  usuarioActual: any;
  token: string | null = null;
  photoUrl: string | null = null;
  posts: Post[] = [];
  postDescription: string = '';
  selectedFile: File | null = null;
  postImageUrl: string | null = null;
  Object = Object;

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private userService: UserService
  ) {
    this.usuarioActual = {};
  }

  ngOnInit(): void {
    this.authService.getToken().subscribe(token => {
      this.token = token;
      console.log('Token:', this.token);
    });

    this.authService.obtenerUsuarioActual().subscribe(user => {
      this.usuarioActual = user;
      if (user && user.photoUrl) {
        this.photoUrl = user.photoUrl;
      }
      this.loadPosts(user.institucion);  // Llamada a loadPosts con la institución del usuario
    });

    this.truncateText();
  }

  loadPosts(institucion: string): void {
    this.postService.getPosts().subscribe(posts => {
      this.posts = posts.filter(post => post.institucion === institucion);
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  toggleModal(): void {
    const modal = document.getElementById('modal');
    if (modal) {
      modal.classList.toggle('hidden');
    }
  }

  truncateText(): void {
    const elements = document.querySelectorAll('.text-truncate');
    elements.forEach((element: HTMLElement) => {
      let text = element.innerText;
      if (text.length > 70) {
        text = text.substring(0, 70) + '...';
        element.innerText = text;
      }
    });
  }

  async uploadFile(): Promise<void> {
    if (this.selectedFile && this.usuarioActual && this.usuarioActual.uid) {
      const storage = getStorage();
      const fileExtension = this.selectedFile.name.split('.').pop();
      const newFileName = `publicaciones/${this.usuarioActual.uid}_${Date.now()}.${fileExtension}`;
      const storageRef = ref(storage, newFileName);
      try {
        await uploadBytes(storageRef, this.selectedFile);
        this.postImageUrl = await getDownloadURL(storageRef);
        console.log('File available at', this.postImageUrl);

        const newPost: Post = {
          userId: this.usuarioActual.uid,
          userName: this.usuarioActual.name,
          userProfileUrl: this.photoUrl,
          imageUrl: this.postImageUrl,
          description: this.postDescription,
          timestamp: Date.now(),
          hearts: {},
          institucion: this.usuarioActual.institucion,
          curso: this.usuarioActual.curso // Asegúrate de que este campo esté presente
        };

        this.postService.addPost(newPost).then(() => {
          console.log('Publicación agregada con éxito');
          this.selectedFile = null;
          this.loadPosts(this.usuarioActual.institucion); // Recargar publicaciones filtradas
        });

      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  }

  updatePosts() {
    if (this.usuarioActual && this.usuarioActual.institucion) {
      this.loadPosts(this.usuarioActual.institucion); // Actualizar publicaciones filtradas
    }
  }

  toggleHeart(postId: string) {
    if (this.usuarioActual?.uid) {
      const post = this.posts.find(post => post.id === postId);
      const hasHeart = post && post.hearts[this.usuarioActual.uid];
      if (hasHeart) {
        this.postService.removeHeart(postId, this.usuarioActual.uid).then(() => {
          this.updatePosts();
        });
      } else {
        this.postService.giveHeart(postId, this.usuarioActual.uid).then(() => {
          this.updatePosts();
        });
      }
    }
  }
}

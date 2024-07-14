import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { AuthService } from '../../../auth/auth.service';
import { PostService } from '../../home/post.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Post } from '../../home/post.model';
import { UserService } from '../../home/user.service';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NavbarComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  usuarioActual: any;
  photoUrl: string;
  posts: Post[] = [];
  friends: any[] = [];
  selectedFile: File | null = null;

  showModal: boolean = false;
  selectedPost: Post | null = null;
  showEditModal: boolean = false;
  selectedImageUrl: string | ArrayBuffer | null = null;

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.authService.obtenerUsuarioActual().subscribe(user => {
      this.usuarioActual = user;
      if (user && user.photoUrl) {
        this.photoUrl = user.photoUrl;
      }
    });

    this.postService.getPosts().subscribe(posts => {
      this.posts = posts.map(post => ({
        ...post,
        hearts: post.hearts || {}
      }));
    });

    this.userService.getFriends().subscribe(friends => {
      this.friends = friends.slice(0, 4);
    });
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      this.selectedFile = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImageUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  async saveEdit() {
    if (this.selectedFile) {
      await this.uploadFile();
    }
    await this.actualizarUsuario(this.usuarioActual);
    Swal.fire('¡Éxito!', 'Datos actualizados correctamente', 'success');
    this.closeEditModal();
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

  openModal(post: Post) {
    this.selectedPost = post;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedPost = null;
  }

  toggleHeart(postId: string) {
    if (this.usuarioActual?.uid) {
      const post = this.posts.find(post => post.id === postId);
      if (post) {
        const hasHeart = post.hearts && post.hearts[this.usuarioActual.uid];
        if (hasHeart) {
          this.postService.removeHeart(postId, this.usuarioActual.uid).then(() => {
            post.hearts[this.usuarioActual.uid] = false;
          });
        } else {
          this.postService.giveHeart(postId, this.usuarioActual.uid).then(() => {
            if (!post.hearts) {
              post.hearts = {};
            }
            post.hearts[this.usuarioActual.uid] = true;
          });
        }
      }
    }
  }

  getHeartsLength(hearts: object): number {
    return Object.keys(hearts).length;
  }

  // Métodos para controlar el modal de edición de datos del usuario
  openEditModal() {
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
  }
}

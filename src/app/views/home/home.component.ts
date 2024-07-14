import { Component, OnInit,Input } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../../auth/auth.service';
import { PostService } from './post.service';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Post } from './post.model';
import { UserService } from './user.service';
import { RouterModule } from '@angular/router';
import { RetoService } from '../../profesor/profesor-reto/reto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule,RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', './my-component-tailwind.css']
})
export class HomeComponent implements OnInit {

 

  Reto01: string = 'https://firebasestorage.googleapis.com/v0/b/ecosystems-f5e54.appspot.com/o/imagen%2Fpost01.jpg?alt=media&token=c2593aea-effa-4871-ae49-df31d07d2917';
  Reto02: string = 'https://firebasestorage.googleapis.com/v0/b/ecosystems-f5e54.appspot.com/o/imagen%2Fpost02.jpg?alt=media&token=dd2e47be-a78f-4707-8faf-84e98a4a3934';
  logoUrl: string = 'https://firebasestorage.googleapis.com/v0/b/ecosystems-f5e54.appspot.com/o/imagen%2Flogo.png?alt=media&token=1b69e0f3-f6fb-4da6-9e62-cb0f617ef410';
  selectedFile: File | null = null;
  postImageUrl: string | null = null;
  photoUrl: string | null = null;
  isModalOpen: boolean = false;
  usuarioActual: any;
  posts: Post[] = [];
  topPosts: Post[] = [];
  friends: any[] = [];
  postDescription: string = '';
  Object = Object;
  showAlert: boolean = false;
  alertMessage: string = '';
  token: string | null = null;
  challenges: any[] = [];
  remainingTime: number | null = null;
  isChallengeModal: boolean = false;
  currentChallenge: any = null;
  hasShownChallengeAlert: boolean = false;

  @Input() currentPage: string;

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private userService: UserService,
    private retoService: RetoService
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
    });

    this.postService.getPosts().subscribe(posts => {
      this.posts = posts;
    });

    this.userService.getFriends().subscribe(friends => {
      this.friends = friends.slice(0, 4);
    });

    this.retoService.obtenerRetos().subscribe(challenges => {
      this.challenges = challenges;
      this.checkChallengesStatus();
      this.updatePosts(); // Actualizar las publicaciones con retos
    });
  }

  checkChallengesStatus() {
    this.challenges = this.challenges.filter(challenge => challenge.tiempoRestante > 0);
    if (this.challenges.length > 0 && !this.hasShownChallengeAlert) {
      this.hasShownChallengeAlert = true;
      Swal.fire({
        icon: 'info',
        title: 'Retos Activos',
        text: 'Hay retos activos disponibles. ¡Participa ahora!',
        showConfirmButton: true,
        confirmButtonText: 'Ver Retos'
      }).then(result => {
        if (result.isConfirmed) {
          // Mostrar retos activos o redirigir a la sección de retos
        }
      });
    }
  }

  openModal(isChallenge: boolean = false, challenge: any = null) {
    this.isModalOpen = true;
    this.isChallengeModal = isChallenge;
    this.currentChallenge = challenge;
  }

  closeModal() {
    this.isModalOpen = false;
    this.isChallengeModal = false;
    this.currentChallenge = null;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async uploadFile() {
    if (this.selectedFile && this.usuarioActual && this.usuarioActual.uid) {
      const storage = getStorage();
      const fileExtension = this.selectedFile.name.split('.').pop();
      const newFileName = `posts/${this.usuarioActual.uid}_${Date.now()}.${fileExtension}`;
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
          curso: this.usuarioActual.curso,
          isChallenge: this.isChallengeModal,
          challengeId: this.isChallengeModal ? this.currentChallenge.id : null
        };

        await this.postService.addPost(newPost);
        console.log('Publicación agregada con éxito');
        this.closeModal();
        this.postDescription = '';
        this.selectedFile = null;

        this.updatePosts();

      } catch (error) {
        console.error('Error uploading file:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Algo salió mal al subir el archivo. Por favor, inténtalo de nuevo.'
        });
      }
    }
  }

  toggleHeart(postId: string) {
    if (this.usuarioActual?.uid) {
      const post = this.posts.find(post => post.id === postId);
      if (!post) {
        console.error('Post not found');
        return;
      }
      // Ensure the hearts object exists
      post.hearts = post.hearts || {};
      const hasHeart = post.hearts[this.usuarioActual.uid];
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
  

  updatePosts() {
    this.postService.getPosts().subscribe(posts => {
      this.posts = posts.map(post => ({
        ...post,
        hearts: post.hearts || {}
      }));
      this.calculateTopPosts();
      this.markChallengePosts(); // Marcar las publicaciones relacionadas con retos activos
    });
  }  

  markChallengePosts() {
    this.posts.forEach(post => {
      const challenge = this.challenges.find(c => c.id === post.challengeId);
      post.isActiveChallenge = challenge && challenge.tiempoRestante > 0;
    });
  }

  calculateTopPosts() {
    this.topPosts = this.posts.sort((a, b) => {
      const aHearts = a.hearts || {};
      const bHearts = b.hearts || {};
      return Object.keys(bHearts).length - Object.keys(aHearts).length;
    }).slice(0, 3);
  }

acceptChallenge(challengeId: string) {
    const challenge = this.challenges.find(c => c.id === challengeId);
    if (challenge) {
      this.showChallengeModal(challenge);
    }
  }

  showChallengeModal(challenge) {
    let interval;
    Swal.fire({
      title: challenge.nombreReto,
      html: `<p>${challenge.description}</p><br/><b id="timer"></b>`,
      timer: challenge.cronometro * 1000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const b = Swal.getHtmlContainer().querySelector('b');
        this.remainingTime = challenge.cronometro;
        interval = setInterval(() => {
          const timeLeft = Math.round(Swal.getTimerLeft() / 1000);
          b.textContent = `${timeLeft} segundos restantes`;
          this.remainingTime = timeLeft;
        }, 1000);
      },
      willClose: () => {
        clearInterval(interval);
        this.remainingTime = null;
      },
      showCancelButton: true,
      confirmButtonText: 'Ir al Reto',
      cancelButtonText: 'Más tarde'
    }).then((result) => {
      if (result.isConfirmed) {
        this.openModal(true, challenge);
      }
    });
  }

  submitChallenge(submission) {
    // Implementar la lógica para enviar el reto
    console.log('Entrega del reto:', submission);
  }
}

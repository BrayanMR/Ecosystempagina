import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RetoService } from './reto.service';
import { Reto } from './reto.model';
import { ProfesornavbarComponent } from '../profesornavbar/profesornavbar.component';
import { RouterModule } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { TimeFormatPipe } from './tiempo/time-format.pipe';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../views/home/user.service';
import { CommonModule } from '@angular/common';
import { PostService } from '../../views/home/post.service';
import { ResultadoRetoComponent } from '../resultado/resultado-reto/resultado-reto.component';

@Component({
  selector: 'app-profesor-reto',
  standalone: true,
  imports: [RouterModule, ProfesornavbarComponent, FormsModule, TimeFormatPipe, CommonModule, ResultadoRetoComponent],
  templateUrl: './profesor-reto.component.html',
  styleUrls: ['./profesor-reto.component.css']
})
export class ProfesorRetoComponent implements OnInit, OnDestroy {
  selectedReto: string = '';
  activeReto: Reto | null = null;
  usuarioActual: any;
  Object = Object;
  ganador: any = null;
  resultado: 'ganador' | 'empate' | 'ninguno' = 'ninguno';
  participatingStudents: any[] = [];
  modalVisible: boolean = false;
  posts: any[] = [];
  filteredPosts: any[] = [];
  retos: { [key: string]: Reto } = {
    'Reto 1': {
      puntos: 0,
      cronometro: 0,
      nombreReto: 'Reto 1',
      descripcion: 'subir una foto #vidanaturaleza',
      timestamp: 0
    },
    'Reto 2': {
      puntos: 0,
      cronometro: 0,
      nombreReto: 'Reto 2',
      descripcion: 'subir una foto con #foreverfruto',
      timestamp: 0
    }
  };
  timeSubscription: Subscription | null = null;
  tiempoRestante: number = 0;
  notificationTimeout: any = null;
  alertShown: boolean = false;

  constructor(
    private router: Router, 
    private authService: AuthService,
    private retoService: RetoService,
    private userService: UserService,
    private postService: PostService
  ) {}
  ngOnInit(): void {
    this.authService.obtenerUsuarioActual().subscribe(user => {
        this.usuarioActual = user;
    });

    this.retoService.obtenerRetos().subscribe(retos => {
        const activeReto = retos.find(reto => reto.tiempoRestante > 0);
        if (activeReto) {
            this.activeReto = activeReto;
            this.tiempoRestante = activeReto.tiempoRestante;
            this.getParticipatingStudents(activeReto.id);
            this.startCronometro();
            this.loadPostsByChallengeId(activeReto.id);
        } else {
            this.activeReto = null; // Asegurarse de que activeReto esté explícitamente asignado
        }
    });
}


  ngOnDestroy(): void {
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
  }

  toggleModal(reto: string = ''): void {
    this.selectedReto = reto;
    this.modalVisible = !this.modalVisible;
  }

  confirmChallenge(): void {
    const reto = this.retos[this.selectedReto];
    reto.timestamp = new Date().getTime();
    reto.tiempoRestante = reto.cronometro * 60;

    this.userService.crearReto(reto).then(() => {
        this.activeReto = reto;
        this.tiempoRestante = reto.tiempoRestante;
        this.startCronometro();
        this.loadPostsByChallengeId(reto.id);
    }).catch(error => {
        console.error('Error creating challenge:', error);
    });

    this.toggleModal();
}


  startChallenge(reto: string): void {
    if (this.activeReto) {
      alert('Ya hay un reto activo.');
      return;
    }

    this.toggleModal(reto);
  }

  startCronometro(): void {
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }

    this.timeSubscription = interval(1000).subscribe(() => {
      if (this.tiempoRestante > 0) {
        this.tiempoRestante--;
        if (this.activeReto && this.activeReto.id) {
          this.retoService.actualizarTiempoRestante(this.activeReto.id, this.tiempoRestante);
        }
      } else {
        this.endChallenge();
      }
    });
  }

  getParticipatingStudents(retoId: string): void {
    this.retoService.obtenerEstudiantesParticipando(retoId).subscribe(students => {
      this.participatingStudents = students;
    });
  }

  loadPostsByChallengeId(challengeId: string): void {
    this.postService.getPostsByChallengeId(challengeId).subscribe(posts => {
      this.posts = posts;
      this.filteredPosts = this.posts.filter(post => post.challengeId === challengeId);
    });
  }

  endChallenge(): void {
    if (this.timeSubscription) {
        this.timeSubscription.unsubscribe();
    }

    if (this.activeReto && !this.alertShown) {
        this.retoService.finalizarReto(this.activeReto.id).then(() => {
            this.postService.getPostsByChallengeId(this.activeReto!.id).subscribe(posts => {
                if (posts.length === 0) {
                    this.resultado = 'ninguno';
                    this.showAlert('Nadie participó en el reto.');
                } else {
                    const ganador = this.seleccionarGanador(posts);
                    if (ganador) {
                        this.ganador = ganador;
                        this.resultado = 'ganador';
                        // Verificar si activeReto está definido antes de pasar
                        if (this.activeReto) {
                            console.log('Llamando a actualizarPuntosYCrearPublicacion con:', this.activeReto);
                            this.actualizarPuntosYCrearPublicacion(ganador, this.activeReto);
                        } else {
                            console.error('Reto activo no definido al intentar actualizar puntos.');
                        }
                        this.showAlert(`¡Felicidades ${ganador.userName}! Has ganado el reto con ${this.postService.getHeartsCount(ganador.hearts)} corazones.`);
                    } else {
                        this.resultado = 'empate';
                        this.showAlert('¡Es un empate! Buen trabajo a todos los participantes.');
                    }
                }
                // Mover la limpieza de activeReto aquí
                this.activeReto = null;
                this.tiempoRestante = 0;
                this.participatingStudents = [];
                this.filteredPosts = [];
            });
        }).catch(error => {
            console.error('Error finalizando el reto:', error);
        });
    } else {
        console.error('No hay reto activo al intentar finalizar.');
    }
}

  seleccionarGanador(posts: any[]): any {
    if (posts.length === 0) {
      return null;
    }

    posts.sort((a, b) => this.postService.getHeartsCount(b.hearts) - this.postService.getHeartsCount(a.hearts));

    if (posts.length > 1 && this.postService.getHeartsCount(posts[0].hearts) === this.postService.getHeartsCount(posts[1].hearts)) {
      return null;
    }

    const ganador = posts[0];
    ganador.points = ganador.points || 0; // Asegurarse de que 'points' está definido y es un número.
    return ganador;
  }

  actualizarPuntosYCrearPublicacion(ganador: any, reto: Reto): void {
    if (!ganador || !reto) {
      console.error('Ganador o reto no definido:', { ganador, reto });
      return;
    }
  
    const puntosGanados = reto.puntos;
  
    this.userService.obtenerUsuario(ganador.userId).subscribe(usuario => {
      if (!usuario || typeof usuario.points !== 'number') {
        console.error('Usuario no definido o no tiene puntos:', usuario);
        return;
      }
  
      // Verificar si el reto ya ha sido completado por el usuario
      if (usuario.retosCompletados && usuario.retosCompletados.includes(reto.id)) {
        console.log(`El reto ${reto.id} ya ha sido completado por el usuario ${ganador.userId}.`);
        return;
      }
  
      const puntosActuales = usuario.points || 0;
      console.log(`Puntos actuales: ${puntosActuales}, Puntos ganados: ${puntosGanados}`);
  
      const nuevosPuntos = puntosActuales + puntosGanados;
      console.log(`Nuevos puntos: ${nuevosPuntos}`);
  
      this.userService.actualizarPuntosYRetos(ganador.userId, nuevosPuntos, reto.id).then(() => {
        console.log('Puntos actualizados y retos completados registrados con éxito');
        // Crear publicación de actualización de puntos
        this.postService.crearPublicacion({
          userId: ganador.userId,
          retoId: reto.id,
          message: `¡${ganador.userName} ha ganado el reto ${reto.nombreReto} y ha recibido ${puntosGanados} puntos!`,
          timestamp: new Date().getTime()
        }).then(() => {
          console.log('Publicación creada con éxito');
        }).catch(error => {
          console.error('Error creando la publicación:', error);
        });
      }).catch(error => {
        console.error('Error actualizando puntos y retos del estudiante:', error);
      });
    });
  }
  

  toggleHeart(postId: string): void {
    if (this.usuarioActual) {
      const post = this.posts.find(p => p.id === postId);
      if (post) {
        const userId = this.usuarioActual.uid;
        if (post.hearts[userId]) {
          this.postService.removeHeart(postId, userId).then(() => {
            post.hearts[userId] = false;
          });
        } else {
          this.postService.giveHeart(postId, userId).then(() => {
            post.hearts[userId] = true;
          });
        }
      }
    }
  }

  showAlert(message: string): void {
    if (!this.alertShown) {
      alert(message);
      this.alertShown = true;
    }
  }
}

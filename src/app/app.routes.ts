import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; // Ensure Routes is imported
import { HomeComponent } from './views/home/home.component';
import { AuthComponent } from './auth/auth.component';
import { PerfilComponent } from './views/perfil/perfil.component';
import { AuthGuard as authGuard } from './tokem/auth.guard';
import { ProfesorGuard } from './tokem/profesor.guard';
import { ColegioGuard } from './tokem/colegio.guard';
import { ColegioHomeComponent } from './colegio/colegio-home/colegio-home.component';
import { ColegioProfesoresComponent } from './colegio/colegio-profesores/colegio-profesores.component';
import { ColegioSolicitudComponent } from './colegio/colegio-solicitud/colegio-solicitud.component';
import { ProfesorHomeComponent } from './profesor/profesor-home/profesor-home.component';
import { ProfesorEstudiantesComponent } from './profesor/profesor-estudiantes/profesor-estudiantes.component';
import { ProfesorSolicitudComponent } from './profesor/profesor-solicitud/profesor-solicitud.component';
import { ProfesorRetoComponent } from './profesor/profesor-reto/profesor-reto.component';
import { ProfileComponent } from './views/profile/profile/profile.component';

export const routes: Routes = [ // Explicitly type routes as Routes
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },

 //estudiante 
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'perfil',
    component: PerfilComponent,
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    component:ProfileComponent,
    canActivate: [authGuard],
  },

  //modo  colegio
  {
    path: 'homeColegio',
    component: ColegioHomeComponent,
    canActivate: [ColegioGuard],
  },
  
  {
    path: 'colegioprofe',
    component:ColegioProfesoresComponent,
    canActivate: [ColegioGuard],
  },
  {
    path: 'solicitudColegio',
    component:ColegioSolicitudComponent,
    canActivate: [ColegioGuard],
  },
  {
    //profesores
    path: 'profesorHome',
    component:ProfesorHomeComponent,
    canActivate: [ProfesorGuard],
  },
  {
    path: 'profesorestudiante',
    component:ProfesorEstudiantesComponent,
    canActivate: [ProfesorGuard],
  },
  {
    path: 'profesoresolicitud',
    component:ProfesorSolicitudComponent,
    canActivate: [ProfesorGuard],
  },
  {
    path: 'RetoProfe',
    component:ProfesorRetoComponent,
    canActivate: [ProfesorGuard],
  },

  
  { path: '**', redirectTo: '/auth' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
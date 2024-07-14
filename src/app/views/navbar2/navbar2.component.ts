import { Component, HostListener } from '@angular/core';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { faSearch, faUserAlt, faBars } from '@fortawesome/free-solid-svg-icons';
import { PerfilComponent } from '../perfil/perfil.component';
import { RouterModule } from '@angular/router';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-navbar2',
  standalone: true,
  imports: [FontAwesomeModule,PerfilComponent,RouterModule,HomeComponent],
  templateUrl: './navbar2.component.html',
  styleUrl: './navbar2.component.css'
})
export class Navbar2Component {
  logoUrl: string = 'https://firebasestorage.googleapis.com/v0/b/ecosystems-f5e54.appspot.com/o/imagen%2Flogo.png?alt=media&token=1b69e0f3-f6fb-4da6-9e62-cb0f617ef410';
  menuOpen = false;

  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas); // Añade todos los iconos del pack fas
    library.addIcons(faSearch, faUserAlt, faBars); // Añade iconos individuales si es necesario
  }

  // Método para escuchar el evento de scroll
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    const navbarDropdown = document.getElementById('navbarDropdown');
    if (navbarDropdown) {
      if (this.menuOpen) {
        navbarDropdown.classList.add('show');
      } else {
        navbarDropdown.classList.remove('show');
      }
    }
  }

}

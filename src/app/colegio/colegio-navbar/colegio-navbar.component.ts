import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-colegio-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './colegio-navbar.component.html',
  styleUrl: './colegio-navbar.component.css'
})
export class ColegioNavbarComponent {
  @Input() currentPage: string;
  constructor() { }

}

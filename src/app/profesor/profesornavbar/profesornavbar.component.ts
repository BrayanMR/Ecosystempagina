import { Component,Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profesornavbar',
  standalone: true,
  imports: [RouterModule,RouterModule],
  templateUrl: './profesornavbar.component.html',
  styleUrl: './profesornavbar.component.css'
})
export class ProfesornavbarComponent {
  @Input() currentPage: string;

}

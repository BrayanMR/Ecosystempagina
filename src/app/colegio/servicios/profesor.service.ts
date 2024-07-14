import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfesorService {
  private apiUrl = 'http://tu-api.com/profesores'; // URL de tu API

  constructor(private http: HttpClient) {}

  getProfesores(role: string, curso: string, institucion: string): Observable<Profesor[]> {
    let params = new HttpParams();
    params = params.append('role', role);
    params = params.append('curso', curso);
    params = params.append('institucion', institucion);

    return this.http.get<Profesor[]>(this.apiUrl, { params });
  }
}

export interface Profesor {
  nombre: string;
  apellido: string;
  documento: string;
  email: string;
  curso: string;
  fotoUrl: string;
}

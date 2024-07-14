import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ColegioGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.authService.obtenerRolUsuarioActual().pipe(
      map(role => role === 'colegio'),
      tap(isColegio => {
        if (!isColegio) {
          this.router.navigate(['/auth']);
        }
      })
    );
  }
}

import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const mainGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkLogin().pipe(
    map(res => {
      return true;
    }),
    catchError((err, caught) => {
      return of(router.parseUrl('/login'));
    })
  );
};

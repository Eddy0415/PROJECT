import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth-service';

const API_BASE = 'https://melaine-palaeobiologic-savourily.ngrok-free.dev/api';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const isOurApi = req.url.startsWith(API_BASE);
  const isAuthCall = req.url.includes('/auth/login') || req.url.includes('/auth/register');
  const token = auth.getToken();
  const canAttach = isOurApi && !isAuthCall && !!token;

  const authedReq = canAttach
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authedReq).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        // only handle 401 for non-check calls — checkAuth handles its own 401
        auth.logout();
        router.navigate([{ outlets: { modal: ['login'] } }]);
      }
      return throwError(() => err);
    }),
  );
};

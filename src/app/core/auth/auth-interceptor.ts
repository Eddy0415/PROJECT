import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http'; // interceptor types  // why: functional interceptor
import { inject } from '@angular/core'; // DI helper                                              // why: rules
import { Router } from '@angular/router'; // redirect on 401                                       // why: auth flow
import { catchError, throwError } from 'rxjs'; // error pipeline                                   // why: handle 401
import { AuthService } from './auth-service'; // token + logout                                    // why: JWT access

const API_BASE = 'https://melaine-palaeobiologic-savourily.ngrok-free.dev/api'; // your backend     // why: only attach to this

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // functional interceptor       // why: rules
  const auth = inject(AuthService); // auth service                                               // why: token + expiry
  const router = inject(Router); // router                                                        // why: redirect
  const isOurApi = req.url.startsWith(API_BASE); // check backend domain                           // why: avoid fakestore calls
  const isAuthCall = req.url.includes('/auth'); // auth endpoints // why: no token yet
  const token = auth.getToken(); // read current token                                             // why: attach header
  const canAttach = isOurApi && !isAuthCall && !!token && !auth.isTokenExpired(token); // safe attach // why: avoid expired
  const authedReq = canAttach
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) // add JWT header            // why: server auth
    : req; // keep request unchanged                                                               // why: public/auth calls

  return next(authedReq).pipe(
    // continue request                                                  // why: interceptor chain
    catchError((err: unknown) => {
      // handle errors                                                // why: 401 logic
      if (err instanceof HttpErrorResponse && err.status === 401) {
        // unauthorized                // why: token invalid/expired
        auth.logout(); // clears session + navigates home (your current behavior)                   // why: consistent state
        router.navigate(['/login'], { queryParams: { returnUrl: router.url } }); // go login        // why: recover flow
      }
      return throwError(() => err); // rethrow                                                     // why: let caller handle too
    }),
  );
};

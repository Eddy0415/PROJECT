import { CanActivateFn } from '@angular/router'; // guard type                              // why: functional guard
import { inject } from '@angular/core'; // DI helper                                       // why: rules
import { Router } from '@angular/router'; // navigation / UrlTree                          // why: redirect
import { AuthService } from './auth-service'; // auth state                                // why: check login

export const authGuard: CanActivateFn = (route, state) => {
  // functional guard            // why: rules
  const auth = inject(AuthService); // get auth service                                   // why: signals
  const router = inject(Router); // get router                                            // why: create redirect

  if (auth.isAuthenticated()) return true; // allow route                                 // why: logged in

  return router.createUrlTree([{ outlets: { modal: ['login'] } }]);
};

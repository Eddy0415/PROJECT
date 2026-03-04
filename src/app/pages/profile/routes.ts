import { Routes } from '@angular/router'; // routes type                                   // why: routing
import { ProfileComponent } from './profile'; // page                                      // why: route component
import { authGuard } from '../../core/auth/auth-guard'; // guard                           // why: protect route

export const PROFILE_ROUTES: Routes = [
  { path: '', component: ProfileComponent, title: 'Profile', canActivate: [authGuard] }, // protect /profile
];

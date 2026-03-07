import { Routes } from '@angular/router';
import { Signup } from './signup';

export const SIGNUP_ROUTES: Routes = [
  { path: '', component: Signup, outlet: 'modal' },
];

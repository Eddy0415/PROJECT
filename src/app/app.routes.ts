import { Routes } from '@angular/router'; // routes type
import { Admin } from './pages/admin/admin';
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomeComponent), // lazy home
  },
  {
    path: 'admin',
    component: Admin,
    title: 'Admin Page',
  },
  {
    path: 'login', // /login
    loadChildren: () => import('./pages/login/routes').then((m) => m.LOGIN_ROUTES), // lazy
  },
  {
    path: 'signup', // /signup
    loadChildren: () => import('./pages/signup/routes').then((m) => m.SIGNUP_ROUTES), // lazy
  },
];

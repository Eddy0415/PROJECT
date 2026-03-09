import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth-guard';
import { adminGuard } from './core/auth/admin-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomeComponent),
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart').then((m) => m.CartPage),
    title: 'My Cart',
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./pages/product-detail/product-detail').then((m) => m.ProductDetailComponent),
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./pages/admin/admin').then((m) => m.Admin),
    title: 'Admin',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
    outlet: 'modal',
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup').then((m) => m.Signup),
    outlet: 'modal',
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about').then((m) => m.AboutComponent),
    title: 'About',
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/profile/profile').then((m) => m.ProfileComponent),
    title: 'Profile',
  },
  {
    path: 'search',
    loadComponent: () => import('./pages/search/search').then((m) => m.SearchComponent),
  },
];

import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth-guard';
import { adminGuard } from './core/auth/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomeComponent),
  },
  {
    path: 'cart',
    loadChildren: () => import('./pages/cart/routes').then((m) => m.CART_ROUTES),
  },
  {
    path: 'products/:id',
    loadChildren: () =>
      import('./pages/product-detail/routes').then((m) => m.PRODUCT_DETAIL_ROUTES),
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () => import('./pages/admin/routes').then((m) => m.ADMIN_ROUTES),
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
    loadChildren: () => import('./pages/about/routes').then((m) => m.ABOUT_ROUTES),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/profile/routes').then((m) => m.PROFILE_ROUTES),
  },
  {
    path: 'search',
    loadChildren: () => import('./pages/search/routes').then((m) => m.SEARCH_ROUTES),
  },
];

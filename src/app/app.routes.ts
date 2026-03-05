import { Routes } from '@angular/router'; // routes type                                                                  // why: routing

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomeComponent), // why: existing home
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
    loadChildren: () => import('./pages/admin/routes').then((m) => m.ADMIN_ROUTES), // ✅ lazy admin                      // why: optimize
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/routes').then((m) => m.LOGIN_ROUTES),
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/routes').then((m) => m.SIGNUP_ROUTES),
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/routes').then((m) => m.PROFILE_ROUTES),
  },
  {
    path: 'search',
    loadChildren: () => import('./pages/search/routes').then((m) => m.SEARCH_ROUTES),
  },
];

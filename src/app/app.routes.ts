import { Routes } from '@angular/router'; // routes type                                                                  // why: routing
import { Admin } from './pages/admin/admin'; // admin                                                                     // why: existing

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomeComponent), // why: existing home
  },
  {
    path: 'cart', // ✅ cart page                                                                                         // why: new feature
    loadChildren: () => import('./pages/cart/routes').then((m) => m.CART_ROUTES), // why: lazy feature routes
  },
  {
    path: 'products/:id', // ✅ product details                                                                           // why: dynamic route
    loadChildren: () =>
      import('./pages/product-detail/routes').then((m) => m.PRODUCT_DETAIL_ROUTES), // why: lazy feature routes
  },
  {
    path: 'admin',
    component: Admin,
    title: 'Admin Page',
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
    path: 'profile', // profile page                                                                                    // why: user page
    loadChildren: () => import('./pages/profile/routes').then((m) => m.PROFILE_ROUTES), // lazy                          // why: optimize
  },
];

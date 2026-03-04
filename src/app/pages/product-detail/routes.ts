import { Routes } from '@angular/router'; // routes type                                                                  // why: routing

export const PRODUCT_DETAIL_ROUTES: Routes = [
  {
    path: '', // feature root (app.routes provides /products/:id)                                                        // why: lazy child route
    loadComponent: () => import('./product-detail').then((m) => m.ProductDetailComponent), // why: lazy component
  },
];

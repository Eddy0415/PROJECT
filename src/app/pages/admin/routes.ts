import { Routes } from '@angular/router'; // routes type                          // why: standalone routing
import { Admin } from './admin'; // admin page                                   // why: route target

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: Admin, // show products grid                                      // why: default admin view
    title: 'Admin',
  },
];

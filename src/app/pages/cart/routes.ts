import { Routes } from '@angular/router'; // routes type                               // why: feature routing
import { CartPage } from './cart'; // standalone page                                 // why: route target

export const CART_ROUTES: Routes = [
  { path: '', component: CartPage, title: 'My Cart' }, // /cart                       // why: feature entry
];
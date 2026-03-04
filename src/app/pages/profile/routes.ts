import { Routes } from '@angular/router'; // routes type                                                                 // why: routing
import { ProfileComponent } from './profile'; // page                                                                    // why: route component

export const PROFILE_ROUTES: Routes = [
  { path: '', component: ProfileComponent, title: 'Profile' }, // /profile                                              // why: entry
];

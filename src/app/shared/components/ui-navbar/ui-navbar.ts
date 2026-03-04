import { ChangeDetectionStrategy, Component } from '@angular/core'; // component + perf mode                          // why: standalone + OnPush
import { RouterLink } from '@angular/router'; // routerLink directive                                                 // why: nav links

@Component({
  selector: 'ui-navbar', // shared navbar                                                                             // why: used globally
  standalone: true, // no NgModule                                                                                    // why: rules
  imports: [RouterLink], // allow routerLink in template                                                               // why: navigation
  templateUrl: './ui-navbar.html', // template                                                                         // why: split files
  styleUrl: './ui-navbar.scss', // scss                                                                                // why: rules
  changeDetection: ChangeDetectionStrategy.OnPush, // optimized change detection                                       // why: performance
})
export class UiNavbarComponent {} // purely presentational for now                                                     // why: no state yet

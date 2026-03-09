import { ChangeDetectionStrategy, Component } from '@angular/core'; // root component                                                             // why: app root
import { RouterOutlet } from '@angular/router'; // routing outlet                                                       // why: render pages
import { UiNavbarComponent } from './shared/components/ui-navbar/ui-navbar'; // navbar                                  // why: global header
import { UiFooter } from './shared/components/ui-footer/ui-footer'; // footer                                  // why: global footer

@Component({
  selector: 'app-root', // root selector                                                                                // why: Angular bootstraps here
  standalone: true, // standalone root                                                                                   // why: rules
  imports: [RouterOutlet, UiNavbarComponent, UiFooter], // template deps                                        // why: render navbar/outlet/footer
  templateUrl: './app.html', // root template
  changeDetection: ChangeDetectionStrategy.OnPush, // why: separate file
  styleUrl: './app.scss', // ✅ switch to scss                                                                            // why: rules
})
export class App {} // keep root clean                                                                                   // why: architecture

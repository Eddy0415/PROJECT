import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'; // signals + DI                     // why: rules
import { Router, RouterLink } from '@angular/router'; // routing                                                        // why: navigate
import { AuthService } from '../../../core/auth/auth-service'; // auth signals                                          // why: existing
import { UiButton } from '../ui-button/ui-button'; // shared button                                                     // why: existing
import { ProductsCatalogStore } from '../../services/products-store'; // prefetch products                      // why: instant search

@Component({
  selector: 'ui-navbar', // shared navbar                                                                               // why: layout
  standalone: true, // no module                                                                                        // why: rules
  imports: [RouterLink, UiButton], // deps                                                                              // why: template
  templateUrl: './ui-navbar.html', // html                                                                              // why: separation
  styleUrl: './ui-navbar.scss', // scss                                                                                 // why: rules
  changeDetection: ChangeDetectionStrategy.OnPush, // optimized                                                         // why: perf
})
export class UiNavbarComponent {
  private readonly router = inject(Router); // router instance                                                          // why: rules
  private readonly auth = inject(AuthService); // auth service                                                          // why: existing
  private readonly catalog = inject(ProductsCatalogStore); // prefetch store                                             // why: fast search

  readonly isAuthenticated = this.auth.isAuthenticated; // computed signal                                               // why: template
  readonly currentUser = this.auth.currentUser; // readonly signal                                                      // why: template

  readonly searchText = signal(''); // navbar search text                                                               // why: global search

  goProfile(): void {
    this.router.navigate(['/profile']); // navigate to profile                                                          // why: existing
  }

  onSearchInput(value: string): void {
    this.searchText.set(value); // update search text                                                                    // why: signal state
  }

  submitSearch(): void {
    const q = this.searchText().trim(); // normalize                                                                     // why: clean URL
    this.router.navigate(['/search'], { queryParams: { q } }); // go to results                                          // why: global search
  }
}

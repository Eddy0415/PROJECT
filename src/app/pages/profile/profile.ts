import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'; // signals                         // why: modern
import { RouterLink } from '@angular/router'; // links                                                                   // why: back/home link
import { AuthService } from '../../core/auth/auth-service'; // auth                                                      // why: user + logout

@Component({
  selector: 'app-profile', // page                                                                                       // why: route page
  standalone: true, // standalone                                                                                        // why: rules
  imports: [RouterLink], // routerLink                                                                                   // why: navigation
  templateUrl: './profile.html', // template                                                                             // why: split files
  styleUrl: './profile.scss', // scss                                                                                    // why: rules
  changeDetection: ChangeDetectionStrategy.OnPush, // perf                                                                // why: signals + OnPush
})
export class ProfileComponent {
  private readonly auth = inject(AuthService); // auth                                                                   // why: state + logout

  readonly user = this.auth.currentUser; // readonly signal                                                              // why: show info
  readonly fullName = computed(() => {
    const u = this.user(); // read                                                                                        // why: computed
    if (!u) return 'User'; // fallback                                                                                    // why: safe UI
    return `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || u.username || 'User'; // name                           // why: display
  });

  logout(): void {
    this.auth.logout(); // clears session + navigates home                                                                // why: flow
  }
}

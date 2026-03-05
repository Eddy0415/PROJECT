import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core'; // signals                   // why: rules
import { RouterLink } from '@angular/router'; // links                                                                   // why: back/home link
import { AuthService } from '../../core/auth/auth-service'; // auth                                                      // why: user + logout
import { ProfileSidebar, ProfileSidebarAction } from './components/profile-sidebar/profile-sidebar'; // sidebar           // why: layout
import { ProfileEdit } from './components/profile-edit/profile-edit'; // edit panel                                      // why: form panel

@Component({
  selector: 'app-profile', // page                                                                                       // why: route page
  standalone: true, // standalone                                                                                        // why: rules
  imports: [RouterLink, ProfileSidebar, ProfileEdit], // deps                                                             // why: render children
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
    return `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || u.username || 'User'; // display                          // why: identity
  });

  readonly active = signal<ProfileSidebarAction>('edit'); // selected sidebar item                                       // why: UI state

  onSidebarAction(action: ProfileSidebarAction): void {
    if (action === 'logout') {
      this.auth.logout(); // existing behavior                                                                           // why: required
      return; // stop                                                                                                     // why: done
    }
    this.active.set(action); // switch view                                                                               // why: edit panel
  }
}

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/auth/auth-service';
import { ProfileSidebar, ProfileSidebarAction } from './components/profile-sidebar/profile-sidebar';
import { ProfileEdit } from './components/profile-edit/profile-edit';
import { UiBreadcrumb } from '../../shared/components/ui-breadcrumb/ui-breadcrumb';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [UiBreadcrumb, ProfileSidebar, ProfileEdit],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  private readonly auth = inject(AuthService);

  readonly user = this.auth.currentUser;
  readonly active = signal<ProfileSidebarAction>('edit');

  onSidebarAction(action: ProfileSidebarAction): void {
    if (action === 'logout') {
      this.auth.logout();
      return;
    }
    this.active.set(action);
  }
}

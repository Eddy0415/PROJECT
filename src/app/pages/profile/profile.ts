import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/auth/auth-service';
import { ProfileEdit } from './components/profile-edit/profile-edit';
import { UiBreadcrumb } from '../../shared/components/ui-breadcrumb/ui-breadcrumb';
import { PageSidebar, SidebarItem } from '../../shared/components/page-sidebar/page-sidebar';

type ProfileView = 'edit' | 'payments';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [UiBreadcrumb, PageSidebar, ProfileEdit],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  private readonly auth = inject(AuthService);

  readonly user = this.auth.currentUser;
  readonly active = signal<ProfileView>('edit');

  readonly sidebarItems: SidebarItem[] = [
    { key: 'edit',     label: 'Edit profile' },
    { key: 'payments', label: 'Payment options', variant: 'disabled' },
    { key: 'logout',   label: 'Logout', variant: 'danger' },
  ];

  onSidebarAction(key: string): void {
    if (key === 'logout') {
      this.auth.logout();
      return;
    }
    this.active.set(key as ProfileView);
  }
}

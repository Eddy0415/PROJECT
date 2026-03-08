import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { UiPill } from '../../../../shared/components/ui-pill/ui-pill';

export type ProfileSidebarAction = 'edit' | 'payments' | 'logout';

@Component({
  selector: 'profile-sidebar',
  standalone: true,
  imports: [UiPill],
  templateUrl: './profile-sidebar.html',
  styleUrl: './profile-sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSidebar {
  readonly active = input<ProfileSidebarAction>('edit');
  readonly action = output<ProfileSidebarAction>();
}

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core'; // signals I/O                         // why: rules

export type ProfileSidebarAction = 'edit' | 'logout'; // actions                                                         // why: simple union

@Component({
  selector: 'profile-sidebar', // component                                                                             // why: reuse on profile
  standalone: true, // standalone                                                                                        // why: rules
  templateUrl: './profile-sidebar.html', // template                                                                     // why: clean
  styleUrl: './profile-sidebar.scss', // scss                                                                            // why: rules
  changeDetection: ChangeDetectionStrategy.OnPush, // perf                                                               // why: signals
})
export class ProfileSidebar {
  readonly active = input<ProfileSidebarAction>('edit'); // current selection                                            // why: highlight active
  readonly action = output<ProfileSidebarAction>(); // emit action                                                        // why: parent handles
}

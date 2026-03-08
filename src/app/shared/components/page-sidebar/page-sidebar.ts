import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { UiPill } from '../ui-pill/ui-pill';

export interface SidebarItem {
  key: string;
  label: string;
  danger?: boolean;    // red styling (e.g. logout)
  disabled?: boolean;  // coming soon — greyed out, not clickable
}

@Component({
  selector: 'page-sidebar',
  standalone: true,
  imports: [UiPill],
  templateUrl: './page-sidebar.html',
  styleUrl: './page-sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageSidebar {
  readonly items = input.required<SidebarItem[]>();
  readonly active = input<string>('');
  readonly action = output<string>();
}

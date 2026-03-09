import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { UiPill, PillVariant } from '../ui-pill/ui-pill';

export interface SidebarItem {
  key: string;
  label: string;
  variant?: PillVariant;
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

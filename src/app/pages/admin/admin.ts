import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { UiBreadcrumb } from '../../shared/components/ui-breadcrumb/ui-breadcrumb';
import { PageSidebar, SidebarItem } from '../../shared/components/page-sidebar/page-sidebar';
import { ProductsDashboard } from './components/products-dashboard/products-dashboard';

type AdminView = 'products' | 'users';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [UiBreadcrumb, PageSidebar, ProductsDashboard],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Admin {
  readonly active = signal<AdminView>('products');

  readonly sidebarItems: SidebarItem[] = [
    { key: 'products', label: 'Products' },
    { key: 'users', label: 'Users', variant: 'disabled' },
  ];

  onSidebarAction(key: string): void {
    this.active.set(key as AdminView);
  }
}

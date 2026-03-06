import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth-service';
import { UiButton } from '../ui-button/ui-button';
import { ProductsCatalogStore } from '../../services/products-store';
import { CartStore } from '../../services/cart.store';

@Component({
  selector: 'ui-navbar',
  standalone: true,
  imports: [RouterLink, UiButton],
  templateUrl: './ui-navbar.html',
  styleUrl: './ui-navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiNavbarComponent {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly catalog = inject(ProductsCatalogStore);
  private readonly cart = inject(CartStore);

  readonly isAuthenticated = this.auth.isAuthenticated;
  readonly currentUser = this.auth.currentUser;
  readonly cartCount = this.cart.totalItems;

  readonly searchText = signal('');

  goProfile(): void {
    this.router.navigate(['/profile']);
  }

  onSearchInput(value: string): void {
    this.searchText.set(value);
  }

  submitSearch(): void {
    const q = this.searchText().trim();
    this.router.navigate(['/search'], { queryParams: { q } });
  }
}

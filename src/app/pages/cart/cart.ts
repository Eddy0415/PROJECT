import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { CartStore } from '../../shared/stores/cart/cart-store';
import { OrdersService } from '../../shared/services/orders/orders-service';
import { AuthService } from '../../core/auth/auth-service';
import { UiButton } from '../../shared/components/button/ui-button';
import { UiBreadcrumb } from '../../shared/components/breadcrumb/ui-breadcrumb';
import { CartTable } from './components/cart-table/cart-table';
import { OrderSummary } from './components/order-summary/order-summary';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [UiButton, UiBreadcrumb, CartTable, OrderSummary],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartPage {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly orders = inject(OrdersService);
  private readonly cart = inject(CartStore);

  readonly lines = this.cart.cartLines;
  readonly subtotal = this.cart.subtotal;
  readonly hasItems = computed(() => this.cart.entries().length > 0);

  readonly placingOrder = signal(false);
  readonly orderSuccess = signal(false);
  readonly orderError = signal<string | null>(null);

  constructor() {
    inject(Title).setTitle('Your Cart — Item Store');
  }

  readonly canOrder = computed(
    () => this.hasItems() && this.auth.isAuthenticated() && !this.placingOrder(),
  );

  goHome(): void {
    this.router.navigate(['/']);
  }

  remove(id: number): void {
    this.cart.remove(id);
  }

  inc(id: number): void {
    this.cart.inc(id);
  }

  dec(id: number): void {
    this.cart.dec(id);
  }

  async checkout(): Promise<void> {
    this.orderError.set(null);

    if (!this.auth.isAuthenticated()) {
      this.router.navigate([{ outlets: { modal: ['login'] } }]);
      return;
    }

    if (!this.hasItems()) return;

    this.placingOrder.set(true);

    try {
      const entries = this.cart.entries();
      await firstValueFrom(this.orders.createCartOrder({ userId: 1, entries }));
      this.orderSuccess.set(true);

      // redirect home after 2.5s so user can read the success label
      setTimeout(() => {
        this.cart.clear();
        this.router.navigate(['/']);
      }, 2500);
    } catch {
      this.orderError.set('Order failed. Please try again.');
    } finally {
      this.placingOrder.set(false);
    }
  }
}

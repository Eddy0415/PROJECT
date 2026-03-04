import { CommonModule, CurrencyPipe } from '@angular/common'; // common + pipe
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core'; // signals + DI
import { Router, RouterLink } from '@angular/router'; // ✅ router for redirect
import { firstValueFrom } from 'rxjs'; // ✅ promise bridge (no subscriptions)

import { CartStore } from '../../shared/services/cart.store'; // cart state
import { OrdersService } from '../../shared/services/orders'; // ✅ order api
import { AuthService } from '../../core/auth/auth-service'; // ✅ auth state
import { UiButton } from '../../shared/components/ui-button/ui-button'; // button
import { UiCounterPill } from '../../shared/components/ui-counter-pill/ui-counter-pill'; // pill
import { CartBinButton } from './components/bin-button/bin-button'; // bin

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, UiButton, UiCounterPill, CartBinButton],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartPage {
  private readonly router = inject(Router); // DI router
  private readonly auth = inject(AuthService); // DI auth
  private readonly orders = inject(OrdersService); // DI orders

  readonly cart = inject(CartStore); // DI cart store
  readonly lines = this.cart.cartLines; // view model
  readonly subtotal = this.cart.subtotal; // totals
  readonly itemsCount = this.cart.totalItems; // badge
  readonly hasItems = computed(() => this.cart.entries().length > 0); // empty check

  readonly placingOrder = signal(false); // ui loading
  readonly orderSuccess = signal(false); // ui success banner
  readonly orderError = signal<string | null>(null); // ui error banner

  readonly canOrder = computed(
    () => this.hasItems() && this.auth.isAuthenticated() && !this.placingOrder(),
  ); // button state

  remove(id: number): void {
    this.cart.remove(id); // drop line
  }

  inc(id: number): void {
    this.cart.inc(id); // +1
  }

  dec(id: number): void {
    this.cart.dec(id); // -1 (min 1 in store)
  }

  async checkout(): Promise<void> {
    this.orderSuccess.set(false); // reset success
    this.orderError.set(null); // reset error

    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/cart' } }); // ✅ force login
      return; // stop
    }

    if (!this.hasItems()) return; // guard

    this.placingOrder.set(true); // start loading

    try {
      const entries = this.cart.entries(); // current entries snapshot
      await firstValueFrom(this.orders.createCartOrder({ userId: 1, entries })); // ✅ POST /carts (FakeStore)
      this.cart.clear(); // ✅ empty cart after success
      this.orderSuccess.set(true); // ✅ show "order received"
    } catch {
      this.orderError.set('Order failed. Please try again.'); // show error
    } finally {
      this.placingOrder.set(false); // stop loading
    }
  }
}

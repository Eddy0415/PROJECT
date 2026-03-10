import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartStore } from '../../../../stores/cart/cart-store';

@Component({
  selector: 'navbar-cart',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar-cart.html',
  styleUrl: './navbar-cart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarCart {
  private readonly cart = inject(CartStore);
  readonly cartCount = this.cart.totalItems;
}

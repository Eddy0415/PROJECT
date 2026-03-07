import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CartProductCard, CartLine } from './components/cart-product-card/cart-product-card';

@Component({
  selector: 'cart-table',
  standalone: true,
  imports: [CartProductCard],
  templateUrl: './cart-table.html',
  styleUrl: './cart-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartTable {
  readonly lines = input.required<CartLine[]>();
  readonly removeClick = output<number>();
  readonly incClick = output<number>();
  readonly decClick = output<number>();
}

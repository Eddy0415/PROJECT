import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CartBinButton } from './components/bin-button/bin-button';
import { UiCounterPill } from '../../../../../../shared/components/ui-counter-pill/ui-counter-pill';

import { CartEntry } from '../../../../../../shared/stores/cart/interfaces/cart-entry';
import { IProduct } from '../../../../../../shared/interfaces/product';

export interface CartLine {
  entry: CartEntry;
  product: IProduct | null;
}

@Component({
  selector: 'cart-product-card',
  standalone: true,
  imports: [CurrencyPipe, CartBinButton, UiCounterPill],
  templateUrl: './cart-product-card.html',
  styleUrl: './cart-product-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartProductCard {
  readonly line = input.required<CartLine>();
  readonly removeClick = output<number>();
  readonly incClick = output<number>();
  readonly decClick = output<number>();
}

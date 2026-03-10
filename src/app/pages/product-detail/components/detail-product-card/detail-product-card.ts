import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { IProduct } from '../../../../shared/interfaces/product';
import { UiButton } from '../../../../shared/components/button/ui-button';
import { UiCounterPill } from '../../../../shared/components/counter-pill/ui-counter-pill';

@Component({
  selector: 'detail-product-card',
  standalone: true,
  imports: [CurrencyPipe, UiButton, UiCounterPill],
  templateUrl: './detail-product-card.html',
  styleUrl: './detail-product-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailProductCard {
  readonly product = input.required<IProduct>();
  readonly qty = input<number>(1);
  readonly decQty = output<void>();
  readonly incQty = output<void>();
  readonly addToCart = output<void>();

  readonly stars = computed(() => {
    const rate = this.product().rating?.rate ?? 0;
    const full = Math.floor(rate);
    const half = rate % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return [
      ...Array(full).fill('full'),
      ...Array(half).fill('half'),
      ...Array(empty).fill('empty'),
    ] as ('full' | 'half' | 'empty')[];
  });
}

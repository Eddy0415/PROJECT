import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IProduct } from '../../../../../../interfaces/product';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCardComponent {
  product = input.required<IProduct>();

  readonly stars = computed(() => {
    const rate = this.product().rating?.rate ?? 0;
    return Array.from({ length: 5 }, (_, i) => {
      if (rate >= i + 1) return 'full';
      if (rate >= i + 0.5) return 'half';
      return 'empty';
    });
  });
}

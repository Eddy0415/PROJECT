import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IProduct } from '../../../../interfaces/product';
import { ProductCardComponent } from './components/product-card/product-card';

@Component({
  selector: 'products-grid',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './products-grid.html',
  styleUrl: './products-grid.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsGrid {
  readonly products = input.required<IProduct[]>();
}

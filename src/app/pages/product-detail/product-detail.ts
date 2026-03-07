import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, map } from 'rxjs';

import { CartStore } from '../../shared/services/cart.store';
import { ProductsCatalogStore } from '../../shared/services/products-store';
import { IProduct } from '../../shared/interfaces/product';
import { UiBreadcrumb } from '../../shared/components/ui-breadcrumb/ui-breadcrumb';
import { DetailProductCard } from './components/detail-product-card/detail-product-card';
import { VisibleProducts } from '../../shared/components/visible-products/visible-products';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [UiBreadcrumb, DetailProductCard, VisibleProducts],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly catalog = inject(ProductsCatalogStore);
  private readonly cart = inject(CartStore);

  readonly qty = signal(1);

  // Read id from route as a signal
  private readonly routeId = toSignal(
    this.route.paramMap.pipe(
      map(pm => Number(pm.get('id') ?? 0)),
      distinctUntilChanged(),
    ),
    { initialValue: 0 },
  );

  // Find product directly from the store — no API call
  readonly product = computed<IProduct | null>(() => {
    const id = this.routeId();
    if (!id) return null;
    return this.catalog.findById(id);
  });

  readonly loading = computed(() => this.catalog.loading());
  readonly error = computed(() => this.catalog.error());

  decQty(): void {
    this.qty.update(v => Math.max(1, v - 1));
  }

  incQty(): void {
    this.qty.update(v => v + 1);
  }

  addToCart(): void {
    const p = this.product();
    if (!p) return;
    this.cart.add(p.id, this.qty());
  }
}

import { CommonModule, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, distinctUntilChanged, map, of, switchMap, tap } from 'rxjs';

import { ProductsService } from '../../shared/services/products';
import { IProduct } from '../../shared/interfaces/product';
import { ProductCardComponent } from '../../shared/components/product-card/product-card';
import { UiButton } from '../../shared/components/ui-button/ui-button';
import { UiCounterPill } from '../../shared/components/ui-counter-pill/ui-counter-pill';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, ProductCardComponent, UiButton, UiCounterPill],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);

  readonly qty = signal(1);

  readonly loadingProduct = signal(true);
  readonly productError = signal<string | null>(null);

  readonly loadingRelated = signal(true);
  readonly relatedError = signal<string | null>(null);

  private readonly product$ = this.route.paramMap.pipe(
    map((pm) => Number(pm.get('id') ?? 0)),
    distinctUntilChanged(),
    tap(() => {
      this.loadingProduct.set(true);
      this.productError.set(null);
    }),
    switchMap((id) => (id ? this.productsService.getById(id) : of(null as IProduct | null))),
    tap(() => this.loadingProduct.set(false)),
    catchError(() => {
      this.productError.set('Failed to load product');
      this.loadingProduct.set(false);
      return of(null as IProduct | null);
    }),
  );

  readonly product = toSignal(this.product$, { initialValue: null as IProduct | null });

  private readonly related$ = toObservable(this.product).pipe(
    map((p) => p?.category ?? null),
    distinctUntilChanged(),
    tap(() => {
      this.loadingRelated.set(true);
      this.relatedError.set(null);
    }),
    switchMap((cat) => (cat ? this.productsService.getByCategory(cat) : of([] as IProduct[]))),
    tap(() => this.loadingRelated.set(false)),
    catchError(() => {
      this.relatedError.set('Failed to load related products');
      this.loadingRelated.set(false);
      return of([] as IProduct[]);
    }),
  );

  readonly relatedList = toSignal(this.related$, { initialValue: [] as IProduct[] });

  readonly relatedProducts = computed(() => {
    const current = this.product();
    const list = this.relatedList();
    if (!current) return [];
    return list.filter((p) => p.id !== current.id).slice(0, 4);
  });

  decQty(): void {
    this.qty.update((v) => v - 1);
  }

  incQty(): void {
    this.qty.update((v) => v + 1);
  }
}

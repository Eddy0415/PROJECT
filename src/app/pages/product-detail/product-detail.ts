import { CommonModule, CurrencyPipe } from '@angular/common'; // common + pipe
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core'; // signals + DI
import { ActivatedRoute } from '@angular/router'; // route params
import { toObservable, toSignal } from '@angular/core/rxjs-interop'; // rxjs-interop
import { catchError, distinctUntilChanged, map, of, switchMap, tap } from 'rxjs'; // rx ops

import { ProductsService } from '../../shared/services/products'; // products api
import { CartStore } from '../../shared/services/cart.store'; // ✅ cart signal store
import { IProduct } from '../../shared/interfaces/product'; // typing
import { ProductCardComponent } from '../../shared/components/product-card/product-card'; // ui
import { UiButton } from '../../shared/components/ui-button/ui-button'; // ui
import { UiCounterPill } from '../../shared/components/ui-counter-pill/ui-counter-pill'; // ui

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, ProductCardComponent, UiButton, UiCounterPill],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent {
  private readonly route = inject(ActivatedRoute); // DI route
  private readonly productsService = inject(ProductsService); // DI api
  private readonly cart = inject(CartStore); // ✅ DI cart store

  readonly qty = signal(1); // qty picker

  readonly loadingProduct = signal(true); // ui state
  readonly productError = signal<string | null>(null); // ui state

  readonly loadingRelated = signal(true); // ui state
  readonly relatedError = signal<string | null>(null); // ui state

  private readonly product$ = this.route.paramMap.pipe(
    map((pm) => Number(pm.get('id') ?? 0)), // id from url
    distinctUntilChanged(), // avoid repeats
    tap(() => {
      this.loadingProduct.set(true); // start loading
      this.productError.set(null); // reset error
    }),
    switchMap((id) => (id ? this.productsService.getById(id) : of(null as IProduct | null))), // fetch
    tap(() => this.loadingProduct.set(false)), // stop loading
    catchError(() => {
      this.productError.set('Failed to load product'); // set error
      this.loadingProduct.set(false); // stop loading
      return of(null as IProduct | null); // recover
    }),
  );

  readonly product = toSignal(this.product$, { initialValue: null as IProduct | null }); // product signal

  private readonly related$ = toObservable(this.product).pipe(
    map((p) => p?.category ?? null), // category
    distinctUntilChanged(), // avoid repeats
    tap(() => {
      this.loadingRelated.set(true); // start loading
      this.relatedError.set(null); // reset error
    }),
    switchMap((cat) => (cat ? this.productsService.getByCategory(cat) : of([] as IProduct[]))), // fetch
    tap(() => this.loadingRelated.set(false)), // stop loading
    catchError(() => {
      this.relatedError.set('Failed to load related products'); // error
      this.loadingRelated.set(false); // stop loading
      return of([] as IProduct[]); // recover
    }),
  );

  readonly relatedList = toSignal(this.related$, { initialValue: [] as IProduct[] }); // list signal

  readonly relatedProducts = computed(() => {
    const current = this.product(); // current product
    const list = this.relatedList(); // related list
    if (!current) return []; // guard
    return list.filter((p) => p.id !== current.id).slice(0, 4); // show 4
  });

  decQty(): void {
    this.qty.update((v) => Math.max(1, v - 1)); // ✅ clamp to min 1
  }

  incQty(): void {
    this.qty.update((v) => v + 1); // increment
  }

  addToCart(): void {
    const p = this.product(); // current product
    if (!p) return; // guard
    this.cart.add(p.id, this.qty()); // ✅ add product id + qty
  }
}

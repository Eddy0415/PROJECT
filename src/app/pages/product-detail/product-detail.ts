import { CommonModule, CurrencyPipe } from '@angular/common'; // common + pipes                              // why: template
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core'; // signals      // why: rules
import { ActivatedRoute } from '@angular/router'; // route params                                           // why: /products/:id
import { toSignal, toObservable } from '@angular/core/rxjs-interop'; // signal <-> observable               // why: bridge without subscriptions
import { catchError, distinctUntilChanged, map, of, switchMap, tap } from 'rxjs'; // rx operators           // why: stream composition

import { ProductsService } from '../../shared/services/products'; // api service                            // why: fetching
import { IProduct } from '../../shared/interfaces/product'; // type                                        // why: typing
import { ProductCardComponent } from '../../shared/components/product-card/product-card'; // related grid   // why: reuse
import { UiButton } from '../../shared/components/ui-button/ui-button'; // button                 // why: reuse

@Component({
  selector: 'app-product-detail', // page                                                                // why: routing
  standalone: true, // standalone                                                                         // why: rules
  imports: [CommonModule, CurrencyPipe, ProductCardComponent, UiButton], // deps                 // why: template
  templateUrl: './product-detail.html', // html                                                           // why: split
  styleUrl: './product-detail.scss', // scss                                                              // why: rules
  changeDetection: ChangeDetectionStrategy.OnPush, // perf                                                 // why: optimization
})
export class ProductDetailComponent {
  private readonly route = inject(ActivatedRoute); // DI                                                  // why: rules
  private readonly productsService = inject(ProductsService); // DI                                       // why: rules

  readonly qty = signal(1); // local state                                                                // why: UI state

  readonly loadingProduct = signal(true); // loading                                                       // why: UI feedback
  readonly productError = signal<string | null>(null); // error                                           // why: UI feedback

  readonly loadingRelated = signal(true); // loading                                                       // why: UI feedback
  readonly relatedError = signal<string | null>(null); // error                                           // why: UI feedback

  readonly productId = toSignal(
    this.route.paramMap.pipe(
      map((pm) => Number(pm.get('id') ?? 0)), // parse :id                                                // why: dynamic route
      distinctUntilChanged(), // avoid refetch on same id                                                  // why: optimization
    ),
    { initialValue: 0 }, // safe init                                                                     // why: template safety
  );

  private readonly product$ = this.route.paramMap.pipe(
    map((pm) => Number(pm.get('id') ?? 0)), // parse :id                                                  // why: id source
    distinctUntilChanged(), // no duplicate calls                                                         // why: optimization
    tap(() => {
      this.loadingProduct.set(true); // start loading                                                     // why: UI
      this.productError.set(null); // reset error                                                         // why: UI
    }),
    switchMap(
      (id) =>
        id
          ? this.productsService.getById(id) // fetch product                                                // why: detail data
          : of(null as IProduct | null), // guard invalid id                                                // why: safe
    ),
    tap(() => this.loadingProduct.set(false)), // stop loading                                             // why: UI
    catchError(() => {
      this.productError.set('Failed to load product'); // set error                                       // why: UX
      this.loadingProduct.set(false); // stop loading                                                     // why: UX
      return of(null as IProduct | null); // safe fallback                                                 // why: render safely
    }),
  );

  readonly product = toSignal(this.product$, { initialValue: null as IProduct | null }); // product signal  // why: template uses signal

  private readonly related$ = toObservable(this.product).pipe(
    map((p) => p?.category ?? null), // derive category                                                    // why: related by category
    distinctUntilChanged(), // only refetch on category change                                             // why: optimization
    tap(() => {
      this.loadingRelated.set(true); // start loading                                                      // why: UI
      this.relatedError.set(null); // reset error                                                          // why: UI
    }),
    switchMap(
      (cat) => (cat ? this.productsService.getByCategory(cat) : of([] as IProduct[])), // fetch related               // why: related products
    ),
    tap(() => this.loadingRelated.set(false)), // stop loading                                             // why: UI
    catchError(() => {
      this.relatedError.set('Failed to load related products'); // set error                              // why: UX
      this.loadingRelated.set(false); // stop loading                                                      // why: UX
      return of([] as IProduct[]); // safe fallback                                                        // why: render safely
    }),
  );

  readonly relatedList = toSignal(this.related$, { initialValue: [] as IProduct[] }); // related signal     // why: template uses signal

  readonly relatedProducts = computed(() => {
    const current = this.product(); // current product                                                     // why: filter itself
    const list = this.relatedList(); // related list                                                        // why: source list
    if (!current) return []; // guard                                                                       // why: safety
    return list.filter((p) => p.id !== current.id).slice(0, 4); // remove itself + limit                    // why: mockup
  });

  decQty(): void {
    // decrease qty                                                                          // why: UI action
    this.qty.update((v) => Math.max(1, v - 1)); // min 1                                                    // why: constraints
  }

  incQty(): void {
    // increase qty                                                                          // why: UI action
    this.qty.update((v) => v + 1); // increment                                                             // why: simple
  }
}

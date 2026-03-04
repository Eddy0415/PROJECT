import { CommonModule } from '@angular/common'; // common directives/pipes
import { Component, computed, inject, signal } from '@angular/core'; // signals + DI
import { toSignal } from '@angular/core/rxjs-interop'; // Observable -> Signal
import { catchError, of, tap } from 'rxjs'; // rx operators

import { HeroCarouselComponent } from './components/hero-carousel/hero-carousel'; // hero section
import { ProductsToolbar, HomeSortMode } from './components/products-toolbar/products-toolbar'; // toolbar
import { ProductCardComponent } from '../../shared/components/product-card/product-card'; // card ui
import { IProduct } from '../../shared/interfaces/product'; // typing
import { ProductsService } from '../../shared/services/products'; // api

@Component({
  selector: 'app-home', // route page
  standalone: true, // no NgModule
  imports: [CommonModule, HeroCarouselComponent, ProductsToolbar, ProductCardComponent], // template deps
  templateUrl: './home.html', // html
  styleUrl: './home.scss', // scss
})
export class HomeComponent {
  private readonly productsService = inject(ProductsService); // DI

  readonly loading = signal(true); // loading state
  readonly error = signal<string | null>(null); // error state

  readonly sortMode = signal<HomeSortMode>('best'); // toolbar: sort
  readonly selectedCategory = signal<string | null>(null); // toolbar: category filter
  readonly minPrice = signal<number | null>(null); // toolbar: min price
  readonly maxPrice = signal<number | null>(null); // toolbar: max price

  private readonly products$ = this.productsService.getAll().pipe(
    // fetch products stream
    tap(() => this.loading.set(false)), // stop loading on success
    catchError(() => {
      // handle error
      this.error.set('Failed to load products'); // set message
      this.loading.set(false); // stop loading
      return of([] as IProduct[]); // fallback
    }),
  );

  readonly products = toSignal(this.products$, { initialValue: [] as IProduct[] }); // products signal

  readonly categories = computed(() => {
    // derive categories list
    const list = this.products(); // read products
    const set = new Set(list.map((p) => p.category).filter(Boolean)); // unique categories
    return Array.from(set).sort((a, b) => a.localeCompare(b)); // A-Z
  });

  readonly visibleProducts = computed(() => {
    // derive visible list
    const list = this.products().slice(); // copy list (avoid mutating)
    const cat = this.selectedCategory(); // read category
    const min = this.minPrice(); // read min
    const max = this.maxPrice(); // read max

    const filtered = list.filter((p) => {
      // apply filters
      if (cat && p.category !== cat) return false; // category filter
      if (min !== null && p.price < min) return false; // min filter
      if (max !== null && p.price > max) return false; // max filter
      return true; // keep product
    });

    const mode = this.sortMode(); // read sort mode

    if (mode === 'priceAsc') return filtered.sort((a, b) => a.price - b.price); // low->high
    if (mode === 'priceDesc') return filtered.sort((a, b) => b.price - a.price); // high->low
    if (mode === 'categoryAz') return filtered.sort((a, b) => a.category.localeCompare(b.category)); // category A-Z

    return filtered.sort((a, b) => {
      // best selling sort
      const ac = a.rating?.count ?? 0; // a count
      const bc = b.rating?.count ?? 0; // b count
      if (bc !== ac) return bc - ac; // higher count first
      const ar = a.rating?.rate ?? 0; // a rate
      const br = b.rating?.rate ?? 0; // b rate
      if (br !== ar) return br - ar; // higher rate first
      return a.id - b.id; // stable fallback
    });
  });

  setSortMode(mode: HomeSortMode): void {
    // handler: sort change
    this.sortMode.set(mode); // update sort
  }

  setCategory(cat: string | null): void {
    // handler: category change
    this.selectedCategory.set(cat); // update category
  }

  setMinPrice(v: number | null): void {
    // handler: min change
    this.minPrice.set(v); // update min
  }

  setMaxPrice(v: number | null): void {
    // handler: max change
    this.maxPrice.set(v); // update max
  }
}

import { CommonModule } from '@angular/common'; // common directives/pipes                                      // why: template
import { Component, computed, inject, signal } from '@angular/core'; // signals + DI                            // why: rules

import { HeroCarouselComponent } from './components/hero-carousel/hero-carousel'; // hero section               // why: UI
import { ProductsToolbar, HomeSortMode } from './components/products-toolbar/products-toolbar'; // toolbar       // why: filtering UI
import { ProductCardComponent } from '../../shared/components/product-card/product-card'; // card ui            // why: UI

import { ProductsCatalogStore } from '../../shared/services/products-store'; // ✅ cached products store         // why: avoid refetch

@Component({
  selector: 'app-home', // route page                                                                            // why: routing
  standalone: true, // no NgModule                                                                               // why: rules
  imports: [CommonModule, HeroCarouselComponent, ProductsToolbar, ProductCardComponent], // deps                 // why: render
  templateUrl: './home.html', // html                                                                            // why: separation
  styleUrl: './home.scss', // scss                                                                               // why: rules
})
export class HomeComponent {
  private readonly catalog = inject(ProductsCatalogStore); // ✅ DI store                                           // why: cached state

  readonly loading = computed(() => this.catalog.loading()); // map store loading                                  // why: template uses loading()
  readonly error = computed(() => this.catalog.error()); // map store error                                        // why: template uses error()

  readonly sortMode = signal<HomeSortMode>('best'); // toolbar: sort                                               // why: UI state
  readonly selectedCategory = signal<string | null>(null); // toolbar: category filter                             // why: UI state
  readonly minPrice = signal<number | null>(null); // toolbar: min price                                           // why: UI state
  readonly maxPrice = signal<number | null>(null); // toolbar: max price                                           // why: UI state

  readonly products = computed(() => this.catalog.products()); // ✅ cached products                                // why: base list is store

  readonly categories = computed(() => this.catalog.categories()); // ✅ derived once in store                       // why: reuse store computed

  readonly visibleProducts = computed(() => {
    const list = this.products().slice(); // copy list (avoid mutating)                                            // why: safe sort
    const cat = this.selectedCategory(); // read category                                                          // why: filter
    const min = this.minPrice(); // read min                                                                       // why: filter
    const max = this.maxPrice(); // read max                                                                       // why: filter

    const filtered = list.filter((p) => {
      if (cat && p.category !== cat) return false; // category filter                                                // why: toolbar
      if (min !== null && p.price < min) return false; // min filter                                                // why: toolbar
      if (max !== null && p.price > max) return false; // max filter                                                // why: toolbar
      return true; // keep                                                                                          // why: pass
    });

    const mode = this.sortMode(); // read sort mode                                                                 // why: sort

    if (mode === 'priceAsc') return filtered.sort((a, b) => a.price - b.price); // low->high                        // why: sort
    if (mode === 'priceDesc') return filtered.sort((a, b) => b.price - a.price); // high->low                       // why: sort
    if (mode === 'categoryAz') return filtered.sort((a, b) => a.category.localeCompare(b.category)); // category A-Z // why: sort

    return filtered.sort((a, b) => {
      const ac = a.rating?.count ?? 0; // a count                                                                   // why: best logic
      const bc = b.rating?.count ?? 0; // b count                                                                   // why: best logic
      if (bc !== ac) return bc - ac; // higher count first                                                          // why: best logic
      const ar = a.rating?.rate ?? 0; // a rate                                                                     // why: best logic
      const br = b.rating?.rate ?? 0; // b rate                                                                     // why: best logic
      if (br !== ar) return br - ar; // higher rate first                                                           // why: best logic
      return a.id - b.id; // stable fallback                                                                        // why: stable
    });
  });

  setSortMode(mode: HomeSortMode): void {
    this.sortMode.set(mode); // update sort                                                                         // why: handler
  }

  setCategory(cat: string | null): void {
    this.selectedCategory.set(cat); // update category                                                               // why: handler
  }

  setMinPrice(v: number | null): void {
    this.minPrice.set(v); // update min                                                                              // why: handler
  }

  setMaxPrice(v: number | null): void {
    this.maxPrice.set(v); // update max                                                                              // why: handler
  }
}

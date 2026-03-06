import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import { HeroCarouselComponent } from './components/hero-carousel/hero-carousel';
import { ProductsToolbar, HomeSortMode } from './components/products-toolbar/products-toolbar';
import { ProductCardComponent } from '../../shared/components/product-card/product-card';
import { ProductsCatalogStore } from '../../shared/services/products-store';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeroCarouselComponent, ProductsToolbar, ProductCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {
  private readonly catalog = inject(ProductsCatalogStore);

  readonly loading = computed(() => this.catalog.loading());
  readonly error = computed(() => this.catalog.error());
  readonly products = computed(() => this.catalog.products());
  readonly categories = computed(() => this.catalog.categories());

  readonly sortMode = signal<HomeSortMode>('best');
  readonly selectedCategory = signal<string | null>(null);

  readonly visibleProducts = computed(() => {
    const list = this.products().slice();
    const cat = this.selectedCategory();

    const filtered = cat ? list.filter((p) => p.category === cat) : list;

    const mode = this.sortMode();
    if (mode === 'priceAsc') return filtered.sort((a, b) => a.price - b.price);
    if (mode === 'priceDesc') return filtered.sort((a, b) => b.price - a.price);
    if (mode === 'categoryAz') return filtered.sort((a, b) => a.category.localeCompare(b.category));

    return filtered.sort((a, b) => {
      const ac = a.rating?.count ?? 0;
      const bc = b.rating?.count ?? 0;
      if (bc !== ac) return bc - ac;
      return (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0);
    });
  });

  setSortMode(mode: HomeSortMode): void {
    this.sortMode.set(mode);
  }
  setCategory(cat: string | null): void {
    this.selectedCategory.set(cat);
  }
}

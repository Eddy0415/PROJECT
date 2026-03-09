import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { IProduct } from '../../../shared/interfaces/product';
import { ProductsCatalogStore } from '../../../shared/services/products-store';
import { ProductsToolbar, SortMode } from './components/products-toolbar/products-toolbar';
import { ProductsGrid } from './components/products-grid/products-grid';

@Component({
  selector: 'visible-products',
  standalone: true,
  imports: [ProductsToolbar, ProductsGrid],
  templateUrl: './visible-products.html',
  styleUrl: './visible-products.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisibleProducts {
  private readonly catalog = inject(ProductsCatalogStore);

  readonly filterCategory = input<string | null>(null);
  readonly filterName = input<string | null>(null);     
  readonly showToolbar = input<boolean>(true);        
  readonly sortMode = signal<SortMode>('best');
  readonly activeCategory = signal<string | null>(null);

  readonly loading = computed(() => this.catalog.loading());
  readonly error = computed(() => this.catalog.error());

  readonly categories = computed(() =>
    this.filterCategory() ? [] : this.catalog.categories()
  );

  readonly visibleProducts = computed(() => {
    const all = this.catalog.products().slice();

    const lockedCat = this.filterCategory();
    const activeCat = this.activeCategory();
    const cat = lockedCat ?? activeCat;
    let filtered = cat ? all.filter((p: IProduct) => p.category === cat) : all;

    const name = this.filterName();
    if (name) {
      const q = name.toLowerCase();
      filtered = filtered.filter((p: IProduct) => p.title.toLowerCase().includes(q));
    }

    const mode = this.sortMode();
    if (mode === 'priceAsc') return filtered.sort((a: IProduct, b: IProduct) => a.price - b.price);
    if (mode === 'priceDesc') return filtered.sort((a: IProduct, b: IProduct) => b.price - a.price);
    if (mode === 'categoryAz')
      return filtered.sort((a: IProduct, b: IProduct) => a.category.localeCompare(b.category));

    return filtered.sort((a: IProduct, b: IProduct) => {
      const ac = a.rating?.count ?? 0;
      const bc = b.rating?.count ?? 0;
      if (bc !== ac) return bc - ac;
      return (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0);
    });
  });
}

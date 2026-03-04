import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core'; // signals-only IO + OnPush

export type HomeSortMode = 'best' | 'priceAsc' | 'priceDesc' | 'categoryAz'; // allowed sort modes

@Component({
  selector: 'app-products-toolbar', // toolbar selector
  standalone: true, // standalone component
  templateUrl: './products-toolbar.html', // template file
  styleUrl: './products-toolbar.scss', // scss file
  changeDetection: ChangeDetectionStrategy.OnPush, // optimized rendering
})
export class ProductsToolbar {
  readonly categories = input<string[]>([]); // input: categories list
  readonly selectedCategory = input<string | null>(null); // input: selected category
  readonly sortMode = input<HomeSortMode>('best'); // input: selected sort mode
  readonly minPrice = input<number | null>(null); // input: min price
  readonly maxPrice = input<number | null>(null); // input: max price

  readonly selectedCategoryChange = output<string | null>(); // output: category changed
  readonly sortModeChange = output<HomeSortMode>(); // output: sort changed
  readonly minPriceChange = output<number | null>(); // output: min changed
  readonly maxPriceChange = output<number | null>(); // output: max changed

  readonly filterOpen = signal(false); // local state: filter panel open/close

  readonly categoryOptions = computed(() => ['All', ...this.categories()]); // derived: include "All"

  toggleFilter(): void {
    // toggle handler
    this.filterOpen.update((v) => !v); // flip open state
  }

  closeFilter(): void {
    // close handler
    this.filterOpen.set(false); // set closed
  }

  onSortChange(value: string): void {
    // sort select handler
    this.sortModeChange.emit(value as HomeSortMode); // emit typed sort mode
  }

  onCategoryChange(value: string): void {
    // category select handler
    const next = value === 'All' ? null : value; // map "All" to null
    this.selectedCategoryChange.emit(next); // emit next category
  }

  onMinChange(value: string): void {
    // min input handler
    const n = value.trim() === '' ? null : Number(value); // parse number or null
    this.minPriceChange.emit(Number.isFinite(n as number) ? n : null); // emit safe value
  }

  onMaxChange(value: string): void {
    // max input handler
    const n = value.trim() === '' ? null : Number(value); // parse number or null
    this.maxPriceChange.emit(Number.isFinite(n as number) ? n : null); // emit safe value
  }

  clearFilters(): void {
    // clear all filters
    this.selectedCategoryChange.emit(null); // reset category
    this.minPriceChange.emit(null); // reset min
    this.maxPriceChange.emit(null); // reset max
    this.closeFilter(); // close panel
  }
}

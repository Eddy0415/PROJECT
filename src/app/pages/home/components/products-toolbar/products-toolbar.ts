import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { UiPill } from '../../../../shared/components/ui-pill/ui-pill';

export type HomeSortMode = 'best' | 'priceAsc' | 'priceDesc' | 'categoryAz';

@Component({
  selector: 'app-products-toolbar',
  standalone: true,
  imports: [UiPill],
  templateUrl: './products-toolbar.html',
  styleUrl: './products-toolbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsToolbar {
  readonly categories = input<string[]>([]);
  readonly selectedCategory = input<string | null>(null);
  readonly sortMode = input<HomeSortMode>('best');

  readonly selectedCategoryChange = output<string | null>();
  readonly sortModeChange = output<HomeSortMode>();

  readonly categoryOptions = computed(() => ['All', ...this.categories()]);

  onSortChange(value: string): void {
    this.sortModeChange.emit(value as HomeSortMode);
  }

  onCategoryChange(value: string): void {
    this.selectedCategoryChange.emit(value === 'All' ? null : value);
  }
}

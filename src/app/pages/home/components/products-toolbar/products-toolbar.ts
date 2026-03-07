import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ToolbarCategories } from './components/toolbar-categories/toolbar-categories';
import { ToolbarSelect } from './components/toolbar-select/toolbar-select';

export type HomeSortMode = 'best' | 'priceAsc' | 'priceDesc' | 'categoryAz';

@Component({
  selector: 'app-products-toolbar',
  standalone: true,
  imports: [ToolbarCategories, ToolbarSelect],
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
}

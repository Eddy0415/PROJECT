import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { UiPill } from '../../../../../pill/ui-pill';

@Component({
  selector: 'toolbar-categories',
  standalone: true,
  imports: [UiPill],
  templateUrl: './toolbar-categories.html',
  styleUrl: './toolbar-categories.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarCategories {
  readonly categories = input<string[]>([]);
  readonly selectedCategory = input<string | null>(null);
  readonly selectedCategoryChange = output<string | null>();

  readonly categoryOptions = computed(() => ['All', ...this.categories()]);

  onCategoryChange(value: string): void {
    this.selectedCategoryChange.emit(value === 'All' ? null : value);
  }
}

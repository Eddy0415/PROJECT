import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { HomeSortMode } from '../../products-toolbar';

@Component({
  selector: 'toolbar-select',
  standalone: true,
  templateUrl: './toolbar-select.html',
  styleUrl: './toolbar-select.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarSelect {
  readonly sortMode = input<HomeSortMode>('best');
  readonly sortModeChange = output<HomeSortMode>();

  onSortChange(value: string): void {
    this.sortModeChange.emit(value as HomeSortMode);
  }
}

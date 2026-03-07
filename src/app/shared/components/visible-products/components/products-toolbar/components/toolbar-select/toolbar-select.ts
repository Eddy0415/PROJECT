import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { SortMode } from '../../products-toolbar';

@Component({
  selector: 'toolbar-select',
  standalone: true,
  templateUrl: './toolbar-select.html',
  styleUrl: './toolbar-select.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarSelect {
  readonly sortMode = input<SortMode>('best');
  readonly sortModeChange = output<SortMode>();

  onSortChange(value: string): void {
    this.sortModeChange.emit(value as SortMode);
  }
}

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export type PillVariant = 'default' | 'danger' | 'disabled';

@Component({
  selector: 'ui-pill',
  standalone: true,
  templateUrl: './ui-pill.html',
  styleUrl: './ui-pill.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiPill {
  readonly label = input<string>('');
  readonly active = input<boolean>(false);
  readonly type = input<'button' | 'submit'>('button');
  readonly variant = input<PillVariant>('default');
  readonly clicked = output<MouseEvent>();
}

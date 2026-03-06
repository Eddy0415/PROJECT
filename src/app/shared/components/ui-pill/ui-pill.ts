import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

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
  readonly disabled = input<boolean>(false);
  readonly clicked = output<MouseEvent>();
}

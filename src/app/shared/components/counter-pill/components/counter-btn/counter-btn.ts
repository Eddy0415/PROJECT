import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'counter-btn',
  standalone: true,
  templateUrl: './counter-btn.html',
  styleUrl: './counter-btn.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterBtn {
  readonly icon = input.required<string>();
  readonly disabled = input<boolean>(false);
  readonly clicked = output<void>();
}

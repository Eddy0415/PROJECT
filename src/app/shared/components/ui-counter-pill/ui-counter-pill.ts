import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CounterBtn } from './components/counter-btn/counter-btn';
import { CounterValue } from './components/counter-value/counter-value';

@Component({
  selector: 'ui-counter-pill',
  standalone: true,
  imports: [CounterBtn, CounterValue],
  templateUrl: './ui-counter-pill.html',
  styleUrl: './ui-counter-pill.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiCounterPill {
  readonly value = input<number>(1);
  readonly min = input<number>(1);
  readonly max = input<number>(10);

  readonly decClick = output<void>();
  readonly incClick = output<void>();

  dec(): void {
    if (this.value() <= this.min()) return;
    this.decClick.emit();
  }

  inc(): void {
    if (this.value() >= this.max()) return;
    this.incClick.emit();
  }
}

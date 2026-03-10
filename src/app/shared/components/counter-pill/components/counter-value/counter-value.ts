import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'counter-value',
  standalone: true,
  templateUrl: './counter-value.html',
  styleUrl: './counter-value.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterValue {
  readonly value = input.required<number>();
}

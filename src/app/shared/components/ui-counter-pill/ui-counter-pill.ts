import { ChangeDetectionStrategy, Component, input, output } from '@angular/core'; // signal io                            // why: rules

@Component({
  selector: 'ui-counter-pill', // shared pill                                                                             // why: reuse
  standalone: true, // no module                                                                                            // why: rules
  templateUrl: './ui-counter-pill.html', // html                                                                           // why: clean
  styleUrl: './ui-counter-pill.scss', // scss                                                                              // why: rules
  changeDetection: ChangeDetectionStrategy.OnPush, // perf                                                                  // why: optimization
})
export class UiCounterPill {
  readonly value = input<number>(1); // current qty                                                                        // why: show state
  readonly min = input<number>(1); // minimum                                                                              // why: clamp                                                            // why: UX
  readonly max = input<number>(10); // maximum
  readonly decClick = output<void>(); // minus pressed                                                                     // why: parent controls state
  readonly incClick = output<void>(); // plus pressed
  dec(): void {
    if (this.value() <= this.min()) return;
    this.decClick.emit();
  }
  inc(): void {
    if (this.value() >= this.max()) return;
    this.incClick.emit();
  }
}

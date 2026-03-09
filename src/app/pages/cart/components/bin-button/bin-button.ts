import { ChangeDetectionStrategy, Component, output } from '@angular/core'; // signal output                               // why: rules

@Component({
  selector: 'cart-bin-button', // page-only                                                                                // why: scoped to cart page
  standalone: true, // no module                                                                                            // why: rules
  templateUrl: './bin-button.html', // html                                                                                // why: clean
  styleUrl: './bin-button.scss', // scss                                                                                   // why: rules
  changeDetection: ChangeDetectionStrategy.OnPush, // perf                                                                  // why: optimization
})
export class CartBinButton {
  readonly removeClick = output<void>(); // notify parent                                                                  // why: parent removes
}

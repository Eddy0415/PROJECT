import { CommonModule, CurrencyPipe } from '@angular/common'; // common + pipe                                             // why: template + money
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'; // signals + DI                      // why: rules
import { RouterLink } from '@angular/router'; // link                                                                       // why: navigation later

import { CartStore } from '../../shared/services/cart.store'; // cart state                                                 // why: single source of truth
import { UiButton } from '../../shared/components/ui-button/ui-button'; // shared button                                   // why: requirement
import { UiCounterPill } from '../../shared/components/ui-counter-pill/ui-counter-pill'; // shared pill                     // why: requirement
import { CartBinButton } from './components/bin-button/bin-button'; // local component                                     // why: requirement

@Component({
  selector: 'app-cart', // page                                                                                             // why: routing
  standalone: true, // no module                                                                                            // why: rules
  imports: [CommonModule, RouterLink, CurrencyPipe, UiButton, UiCounterPill, CartBinButton], // deps                       // why: template uses them
  templateUrl: './cart.html', // html                                                                                      // why: clean
  styleUrl: './cart.scss', // scss                                                                                         // why: rules
  changeDetection: ChangeDetectionStrategy.OnPush, // perf                                                                  // why: optimization
})
export class CartPage {
  readonly cart = inject(CartStore); // DI                                                                                  // why: rules
  readonly lines = this.cart.cartLines; // view model                                                                       // why: template reads
  readonly subtotal = this.cart.subtotal; // computed sum from API price                                                    // why: requirement
  readonly itemsCount = this.cart.totalItems; // qty total                                                                  // why: UI
  readonly hasItems = computed(() => this.cart.entries().length > 0); // empty check                                        // why: conditional UI

  remove(id: number): void {
    this.cart.remove(id); // drop line                                                                                      // why: bin
  }

  inc(id: number): void {
    this.cart.inc(id); // +1                                                                                                // why: counter
  }

  dec(id: number): void {
    this.cart.dec(id); // -1                                                                                                // why: counter
  }

  checkout(): void {
    // no logic yet (later route + auth guard)                                                                              // why: your request
    alert('Checkout not implemented yet'); // placeholder                                                                   // why: visible feedback
  }
}

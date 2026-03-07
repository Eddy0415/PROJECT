import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CurrencyPipe, NgClass } from '@angular/common';
import { UiButton } from '../../../../shared/components/ui-button/ui-button';

@Component({
  selector: 'cart-order-summary',
  standalone: true,
  imports: [CurrencyPipe, NgClass, UiButton],
  templateUrl: './order-summary.html',
  styleUrl: './order-summary.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderSummary {
  readonly subtotal = input.required<number>();
  readonly canOrder = input<boolean>(false);
  readonly placingOrder = input<boolean>(false);
  readonly orderSuccess = input<boolean>(false);
  readonly checkout = output<void>();

  readonly btnLabel = computed(() => {
    if (this.orderSuccess()) return 'Order Received , Returning home...';
    if (this.placingOrder()) return 'Loading...';
    return 'Go to Checkout →';
  });
}

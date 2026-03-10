import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { UiButton, ButtonVariant } from '../../../../shared/components/button/ui-button';

@Component({
  selector: 'cart-order-summary',
  standalone: true,
  imports: [CurrencyPipe, UiButton],
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

  readonly btnVariant = computed((): ButtonVariant => {
    if (this.orderSuccess()) return 'success';
    if (this.placingOrder()) return 'loading';
    return 'default';
  });
}

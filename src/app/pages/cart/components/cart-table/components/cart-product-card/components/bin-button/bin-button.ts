import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'cart-bin-button',
  standalone: true,
  templateUrl: './bin-button.html',
  styleUrl: './bin-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartBinButton {
  readonly removeClick = output<void>();
}

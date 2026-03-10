import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export type ButtonVariant = 'default' | 'success' | 'danger' | 'loading';

@Component({
  selector: 'ui-button',
  standalone: true,
  templateUrl: './ui-button.html',
  styleUrl: './ui-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiButton {
  readonly text = input<string>('Button');
  readonly type = input<'button' | 'submit'>('button');
  readonly disabled = input<boolean>(false);
  readonly variant = input<ButtonVariant>('default');
  readonly clicked = output<MouseEvent>();
}

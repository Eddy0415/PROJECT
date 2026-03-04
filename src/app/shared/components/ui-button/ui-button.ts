import { ChangeDetectionStrategy, Component, input, output } from '@angular/core'; // standalone + signal inputs

@Component({
  selector: 'ui-button', // reusable button
  standalone: true, // no NgModule
  templateUrl: './ui-button.html', // external template
  styleUrl: './ui-button.scss', // scss only
  changeDetection: ChangeDetectionStrategy.OnPush, // optimized
})
export class UiButton {
  readonly text = input<string>('Button'); // label
  readonly type = input<'button' | 'submit'>('button');
  readonly disabled = input<boolean>(false);
  readonly clicked = output<MouseEvent>();
}

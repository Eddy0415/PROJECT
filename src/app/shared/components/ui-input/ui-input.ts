import { ChangeDetectionStrategy, Component, input } from '@angular/core'; // standalone + signal inputs
import { ReactiveFormsModule, FormControl } from '@angular/forms'; // typed reactive forms

@Component({
  selector: 'ui-input', // reusable input
  standalone: true, // no NgModule
  imports: [ReactiveFormsModule], // formControl binding
  templateUrl: './ui-input.html', // external template
  styleUrl: './ui-input.scss', // scss only
  changeDetection: ChangeDetectionStrategy.OnPush, // optimized
})
export class UiInput {
  readonly control = input.required<FormControl<string>>(); // typed control passed from page
  readonly placeholder = input<string>(''); // placeholder text
  readonly type = input<'text' | 'password' | 'email'>('text'); // input type
  readonly icon = input<'user' | 'mail' | 'lock'>('user'); // left icon variant
}

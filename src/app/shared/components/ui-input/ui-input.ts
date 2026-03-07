import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'ui-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './ui-input.html',
  styleUrl: './ui-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiInput {
  readonly control = input.required<FormControl<string>>();
  readonly placeholder = input<string>('');
  readonly type = input<'text' | 'password' | 'email'>('text');
  readonly icon = input<'user' | 'mail' | 'lock'>('user');
  readonly submitted = input<boolean>(false);

  readonly visible = signal(false);

  readonly iconName = computed(() => {
    switch (this.icon()) {
      case 'user': return 'person';
      case 'mail': return 'mail';
      case 'lock': return 'lock';
    }
  });

  readonly inputType = computed(() =>
    this.type() === 'password' && this.visible() ? 'text' : this.type()
  );

  readonly showError = computed(() =>
    this.submitted() && this.control().invalid
  );

  toggleVisible(): void {
    this.visible.update(v => !v);
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../core/auth/auth-service';
import { UiModal } from '../../shared/components/ui-modal/ui-modal';
import { UiInput } from '../../shared/components/ui-input/ui-input';
import { UiButton } from '../../shared/components/ui-button/ui-button';

type LoginFormModel = {
  email: FormControl<string>;
  password: FormControl<string>;
};

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, UiModal, UiInput, UiButton],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly apiError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group<LoginFormModel>({
    email: this.fb.nonNullable.control('', { validators: [Validators.required] }),
    password: this.fb.nonNullable.control('', { validators: [Validators.required] }),
  });

  readonly canSubmit = computed(() => this.form.valid && !this.isSubmitting());

  constructor() {
    effect(() => {
      if (this.auth.isAuthenticated()) {
        this.router.navigate([{ outlets: { modal: null } }]);
      }
    });
  }

  goSignup(): void {
    this.router.navigate([{ outlets: { modal: ['signup'] } }]);
  }

  async submit(): Promise<void> {
    this.apiError.set(null);
    if (this.isSubmitting()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSubmitting.set(true);
    try {
      await firstValueFrom(this.auth.login(this.form.getRawValue()));
      this.router.navigate([{ outlets: { modal: null } }]);
    } catch {
      this.apiError.set('Login failed. Please try again.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}

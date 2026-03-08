import {
  ChangeDetectionStrategy,
  Component,
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
import { AuthModalService } from '../../shared/services/auth-modal.service';

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
  private readonly authModal = inject(AuthModalService);

  readonly isSubmitting = signal(false);
  readonly submitted = signal(false);
  readonly apiError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group<LoginFormModel>({
    email:    this.fb.nonNullable.control('', { validators: [Validators.required, Validators.email] }),
    password: this.fb.nonNullable.control('', { validators: [Validators.required] }),
  });

  constructor() {
    const pending = this.authModal.consumeError();
    if (pending) this.apiError.set(pending);

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
    this.submitted.set(true);
    this.apiError.set(null);
    if (this.isSubmitting() || this.form.invalid) return;
    this.isSubmitting.set(true);
    try {
      await firstValueFrom(this.auth.login(this.form.getRawValue()));
      this.router.navigate([{ outlets: { modal: null } }]);
    } catch {
      this.apiError.set('Wrong email or password.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}

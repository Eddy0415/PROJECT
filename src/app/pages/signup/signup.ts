import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../core/auth/auth-service';
import { ISignupRequ } from '../../core/auth/Interfaces/Signup';
import { UiModal } from '../../shared/components/ui-modal/ui-modal';
import { UiInput } from '../../shared/components/ui-input/ui-input';
import { UiButton } from '../../shared/components/ui-button/ui-button';
import { AuthModalService } from '../../shared/services/auth-modal.service';

interface SignupFormModel {
  firstName:       FormControl<string>;
  lastName:        FormControl<string>;
  username:        FormControl<string>;
  email:           FormControl<string>;
  password:        FormControl<string>;
  confirmPassword: FormControl<string>;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, UiModal, UiInput, UiButton],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Signup {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly authModal = inject(AuthModalService);

  readonly isSubmitting = signal(false);
  readonly submitted = signal(false);
  readonly apiError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group<SignupFormModel>(
    {
      firstName:       this.fb.nonNullable.control('', { validators: [Validators.required] }),
      lastName:        this.fb.nonNullable.control('', { validators: [Validators.required] }),
      username:        this.fb.nonNullable.control('', { validators: [Validators.required] }),
      email:           this.fb.nonNullable.control('', { validators: [Validators.required, Validators.email] }),
      password:        this.fb.nonNullable.control('', { validators: [Validators.required, Validators.minLength(6)] }),
      confirmPassword: this.fb.nonNullable.control('', { validators: [Validators.required] }),
    },
    { validators: [passwordMatchValidator] },
  );

  // true when submitted AND the two password values don't match
  readonly passwordMismatch = computed(() =>
    this.submitted() && !!this.form.errors?.['passwordMismatch']
  );

  constructor() {
    effect(() => {
      if (this.auth.isAuthenticated()) {
        this.router.navigate([{ outlets: { modal: null } }]);
      }
    });
  }

  goLogin(): void {
    this.router.navigate([{ outlets: { modal: ['login'] } }]);
  }

  async submit(): Promise<void> {
    this.submitted.set(true);
    this.apiError.set(null);
    if (this.isSubmitting() || this.form.invalid) return;
    this.isSubmitting.set(true);
    try {
      const raw = this.form.getRawValue();
      const payload: ISignupRequ = {
        username:    raw.username.trim(),
        email:       raw.email.trim(),
        password:    raw.password,
        firstName:   raw.firstName.trim(),
        lastName:    raw.lastName.trim(),
        dateOfBirth: new Date('2000-01-01'),
        imageUrl:    '',
      };
      await firstValueFrom(this.auth.register(payload));
      this.router.navigate([{ outlets: { modal: null } }]);
    } catch (err: unknown) {
      const http = err as { status?: number };
      if (http?.status === 409) {
        this.authModal.setPendingError('Account already exists. Please log in.');
        this.router.navigate([{ outlets: { modal: ['login'] } }]);
      } else {
        this.apiError.set('Signup failed. Please check your information.');
      }
    } finally {
      this.isSubmitting.set(false);
    }
  }
}

function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const pw  = group.get('password')?.value as string;
  const cpw = group.get('confirmPassword')?.value as string;
  if (!pw || !cpw) return null;
  return pw === cpw ? null : { passwordMismatch: true };
}

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core'; // signals + effect
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms'; // typed reactive forms
import { Router, RouterLink } from '@angular/router'; // navigation
import { firstValueFrom } from 'rxjs'; // Observable -> Promise
import { AuthService } from '../../core/auth/auth-service'; // auth logic
import { IAuthError } from '../../core/auth/Interfaces/AuthError'; // typed backend error
import { ISignupRequ } from '../../core/auth/Interfaces/Signup'; // request interface you already have
import { UiModal } from '../../shared/components/ui-modal/ui-modal'; // modal
import { UiInput } from '../../shared/components/ui-input/ui-input'; // shared input
import { UiButton } from '../../shared/components/ui-button/ui-button'; // shared button

type SignupFormModel = {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  username: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
};

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, UiModal, UiInput, UiButton],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Signup {
  private readonly fb = inject(FormBuilder); // DI
  private readonly auth = inject(AuthService); // auth service
  private readonly router = inject(Router); // router

  readonly isSubmitting = signal(false); // loading
  readonly apiError = signal<string | null>(null); // error message
  readonly submitted = signal(false); // ✅ used to show validation errors after submit attempt                         // why: fix template binding

  readonly form = this.fb.nonNullable.group<SignupFormModel>(
    {
      firstName: this.fb.nonNullable.control('', { validators: [Validators.required] }),
      lastName: this.fb.nonNullable.control('', { validators: [Validators.required] }),
      username: this.fb.nonNullable.control('', { validators: [Validators.required] }),
      email: this.fb.nonNullable.control('', {
        validators: [Validators.required, Validators.email],
      }),
      password: this.fb.nonNullable.control('', {
        validators: [Validators.required, Validators.minLength(6)],
      }),
      confirmPassword: this.fb.nonNullable.control('', { validators: [Validators.required] }),
    },
    { validators: [this.passwordMatchValidator] },
  );

  readonly canSubmit = computed(() => this.form.valid && !this.isSubmitting()); // enable/disable

  constructor() {
    effect(() => {
      // if already logged in, go home
      if (this.auth.isAuthenticated()) {
        this.router.navigateByUrl('/'); // redirect home
      }
    });
  }

  async submit(): Promise<void> {
    this.submitted.set(true);
    this.apiError.set(null); // clear

    if (this.isSubmitting()) return; // avoid double submit
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // show errors
      return;
    }

    this.isSubmitting.set(true); // start loading

    try {
      const raw = this.form.getRawValue(); // typed values
      const payload: ISignupRequ = this.mapToSignupRequest(raw); // adapt to API contract
      await firstValueFrom(this.auth.register(payload)); // call register
      await this.router.navigateByUrl('/'); // success -> home
    } catch (err: unknown) {
      const { message, shouldGoLogin } = this.parseSignupError(err); // map backend error
      this.apiError.set(message); // show
      if (shouldGoLogin) {
        await this.router.navigateByUrl('/login'); // account exists -> login
      }
    } finally {
      this.isSubmitting.set(false); // stop loading
    }
  }

  private mapToSignupRequest(raw: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): ISignupRequ {
    return {
      username: raw.username.trim(),
      email: raw.email.trim(),
      password: raw.password,
      firstName: raw.firstName.trim(),
      lastName: raw.lastName.trim(),
      dateOfBirth: new Date('2000-01-01'),
      imageUrl: '',
    };
  }

  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value as string | null; // read password
    const confirm = group.get('confirmPassword')?.value as string | null; // read confirm
    if (!password || !confirm) return null; // let required validators handle empties
    return password === confirm ? null : { passwordMismatch: true }; // mismatch error
  }

  private parseSignupError(err: unknown): { message: string; shouldGoLogin: boolean } {
    const http = err as { status?: number };
    if (http?.status === 409) {
      return {
        message: 'Account already exists. Please login.',
        shouldGoLogin: true,
      };
    }
    return {
      message: 'Signup failed. Please check your information.',
      shouldGoLogin: false,
    };
  }
}

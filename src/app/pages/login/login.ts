import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core'; // signals + effect
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms'; // typed reactive forms
import { Router, RouterLink } from '@angular/router'; // navigation
import { firstValueFrom } from 'rxjs'; // convert Observable -> Promise (no manual subscribe)
import { AuthService } from '../../core/auth/auth-service'; // auth logic
import { IAuthError } from '../../core/auth/Interfaces/AuthError'; // typed backend error
import { UiModal } from '../../shared/components/ui-modal/ui-modal'; // modal shell
import { UiInput } from '../../shared/components/ui-input/ui-input'; // shared input
import { UiButton } from '../../shared/components/ui-button/ui-button'; // shared button

type LoginFormModel = {
  email: FormControl<string>;
  password: FormControl<string>;
};

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, UiModal, UiInput, UiButton],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly fb = inject(FormBuilder); // DI via inject()
  private readonly auth = inject(AuthService); // auth service
  private readonly router = inject(Router); // router
  readonly isSubmitting = signal(false); // UI loading state
  readonly apiError = signal<string | null>(null); // UI error message (string for template)

  readonly form = this.fb.nonNullable.group<LoginFormModel>({
    email: this.fb.nonNullable.control('', { validators: [Validators.required] }), // required
    password: this.fb.nonNullable.control('', { validators: [Validators.required] }), // required
  });

  readonly canSubmit = computed(() => this.form.valid && !this.isSubmitting()); // enable/disable logic

  constructor() {
    effect(() => {
      // react to auth state
      if (this.auth.isAuthenticated()) {
        // already logged in
        this.router.navigateByUrl('/'); // send home
      }
    }); // single effect (no lifecycle hooks)
  }

  async submit(): Promise<void> {
    // called by ngSubmit
    this.apiError.set(null); // clear error

    if (this.isSubmitting()) return; // avoid double submit
    if (this.form.invalid) {
      // mark for UI errors
      this.form.markAllAsTouched(); // show validation
      return; // stop
    }

    this.isSubmitting.set(true); // start loading

    try {
      await firstValueFrom(this.auth.login(this.form.getRawValue())); // call login (no subscribe)
      await this.router.navigateByUrl('/'); // success -> home
    } catch (err: unknown) {
      const { message } = this.parseLoginError(err); // map backend error
      this.apiError.set(message); // show message
    } finally {
      this.isSubmitting.set(false); // stop loading
    }
  }

  private parseLoginError(err: unknown): { message: string } {
    const http = err as { status?: number; error?: Partial<IAuthError> }; // HttpError-like

    const status = http?.status ?? 0; // status code
    const backendMsg = (http?.error?.message ?? http?.error?.error ?? '').toString(); // message
    const backendErrors = Array.isArray(http?.error?.errors) ? http.error.errors : []; // list
    const combined = [backendMsg, ...backendErrors].filter(Boolean).join(' • '); // join into one
    const msg = combined || 'Login failed. Please try again.'; // fallback
    const lower = msg.toLowerCase(); // for matching
    return { message: msg };
  }
}

import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core'; // signals + effect     // why: rules
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms'; // typed forms                 // why: rules
import { firstValueFrom } from 'rxjs'; // await observables                                                               // why: no manual subscriptions
import { UiInput } from '../../../../shared/components/ui-input/ui-input'; // ui input                                    // why: shared component
import { UiButton } from '../../../../shared/components/ui-button/ui-button'; // ui button                                // why: shared component
import { IUser } from '../../../../shared/interfaces/user'; // types                                                      // why: type safety
import { AuthService } from '../../../../core/auth/auth-service'; // api + persist                                       // why: update/delete
import { Router } from '@angular/router'; // navigation                                                                  // why: home after delete

type ProfileFormModel = {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  username: FormControl<string>;
  email: FormControl<string>;
  dateOfBirth: FormControl<string>;
  password: FormControl<string>;
  role: FormControl<string>;
};

@Component({
  selector: 'profile-edit', // component                                                                                 // why: profile page body
  standalone: true, // standalone                                                                                        // why: rules
  imports: [ReactiveFormsModule, UiInput, UiButton], // deps                                                              // why: form + UI
  templateUrl: './profile-edit.html', // template                                                                        // why: clean
  styleUrl: './profile-edit.scss', // scss                                                                               // why: rules
  changeDetection: ChangeDetectionStrategy.OnPush, // perf                                                               // why: signals
})
export class ProfileEdit {
  private readonly fb = inject(FormBuilder); // DI                                                                       // why: rules
  private readonly auth = inject(AuthService); // DI                                                                     // why: calls + persist
  private readonly router = inject(Router); // DI                                                                        // why: navigate after delete

  readonly user = input.required<IUser | null>(); // passed from Profile page                                            // why: prefill

  readonly isSaving = signal(false); // loading                                                                          // why: disable buttons
  readonly isDeleting = signal(false); // loading                                                                        // why: disable buttons
  readonly apiError = signal<string | null>(null); // error text                                                         // why: show message
  readonly selectedFile = signal<File | null>(null); // optional avatar                                                  // why: PATCH supports file

  readonly form = this.fb.group<ProfileFormModel>({
    firstName: this.fb.control('', { nonNullable: true, validators: [Validators.required] }), // required                // why: basic validation
    lastName: this.fb.control('', { nonNullable: true, validators: [Validators.required] }), // required                 // why: basic validation
    username: this.fb.control('', { nonNullable: true, validators: [Validators.required] }), // required                 // why: basic validation
    email: this.fb.control('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }), // email     // why: email format
    dateOfBirth: this.fb.control('', { nonNullable: true }), // optional                                                   // why: backend accepts string
    password: this.fb.control('', { nonNullable: true }), // optional new password
    role: this.fb.control('', { nonNullable: true }),
  });

  constructor() {
    effect(() => {
      const u = this.user(); // read input                                                                               // why: react to changes
      if (!u) return; // safe                                                                                            // why: no crash

      this.apiError.set(null); // clear error                                                                            // why: fresh state

      this.form.patchValue(
        {
          firstName: u.firstName ?? '', // set                                                                            // why: prefill
          lastName: u.lastName ?? '', // set                                                                              // why: prefill
          username: u.username ?? '', // set                                                                              // why: prefill
          email: u.email ?? '', // set                                                                                    // why: prefill
          dateOfBirth: this.toDateInputValue(u.dateOfBirth), // yyyy-mm-dd                                                // why: input value
          password: '', // keep empty
          role: u.role ?? '', // why: avoid undefined in control
        },
        { emitEvent: false }, // avoid extra events                                                                       // why: clean patch
      );
    });
  }

  onFileSelected(ev: Event): void {
    const inputEl = ev.target as HTMLInputElement; // cast                                                                // why: TS
    const file = inputEl.files?.[0] ?? null; // first file                                                               // why: single file
    this.selectedFile.set(file); // store                                                                                // why: submit later
  }

  async update(): Promise<void> {
    this.apiError.set(null); // reset                                                                                    // why: clean UX
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // show validation                                                                    // why: UX
      return; // stop                                                                                                     // why: invalid
    }

    this.isSaving.set(true); // loading                                                                                  // why: disable
    try {
      const v = this.form.getRawValue(); // read values                                                                   // why: payload
      await firstValueFrom(
        this.auth.updateUser({
          firstName: v.firstName.trim(), // send                                                                          // why: patch
          lastName: v.lastName.trim(), // send                                                                            // why: patch
          username: v.username.trim(), // send                                                                            // why: patch
          email: v.email.trim(), // send                                                                                  // why: patch
          dateOfBirth: v.dateOfBirth ? v.dateOfBirth : undefined, // optional                                             // why: patch minimal
          password: v.password.trim() ? v.password.trim() : undefined,
          role: v.role.trim(),
          file: this.selectedFile(), // optional                                                                          // why: supported by API
        }),
      );

      this.form.controls.password.setValue(''); // clear password field                                                   // why: security + UX
      this.selectedFile.set(null); // clear file                                                                          // why: UX
    } catch (e: any) {
      this.apiError.set(e?.error?.message ?? 'Update failed'); // show backend message if available                       // why: UX
    } finally {
      this.isSaving.set(false); // stop loading                                                                           // why: UX
    }
  }

  async deleteAccount(): Promise<void> {
    this.apiError.set(null); // reset                                                                                    // why: clean UX
    this.isDeleting.set(true); // loading                                                                                // why: disable
    try {
      await firstValueFrom(this.auth.deleteAccount()); // clears session + navigates home                                 // why: required
      this.router.navigate(['/']); // extra safety                                                                        // why: ensure home
    } catch (e: any) {
      this.apiError.set(e?.error?.message ?? 'Delete failed'); // show backend message if available                       // why: UX
    } finally {
      this.isDeleting.set(false); // stop                                                                                // why: UX
    }
  }

  private toDateInputValue(d: any): string {
    const date = d instanceof Date ? d : new Date(d); // normalize                                                       // why: api sometimes returns string
    if (Number.isNaN(date.getTime())) return ''; // invalid                                                               // why: safe
    const yyyy = String(date.getFullYear()); // year                                                                     // why: format
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // month                                                     // why: format
    const dd = String(date.getDate()).padStart(2, '0'); // day                                                           // why: format
    return `${yyyy}-${mm}-${dd}`; // yyyy-mm-dd                                                                           // why: input type date
  }
}

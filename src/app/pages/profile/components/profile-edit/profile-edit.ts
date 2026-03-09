import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
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
import { firstValueFrom } from 'rxjs';
import { UiInput } from '../../../../shared/components/ui-input/ui-input';
import { UiButton } from '../../../../shared/components/ui-button/ui-button';
import { IUser } from '../../../../shared/interfaces/user';
import { AuthService } from '../../../../core/auth/auth-service';

interface ProfileFormModel {
  firstName:       FormControl<string>;
  lastName:        FormControl<string>;
  username:        FormControl<string>;
  email:           FormControl<string>;
  dateOfBirth:     FormControl<string>;
  password:        FormControl<string>;
  confirmPassword: FormControl<string>;
  role:            FormControl<string>;
}

@Component({
  selector: 'profile-edit',
  standalone: true,
  imports: [ReactiveFormsModule, UiInput, UiButton],
  templateUrl: './profile-edit.html',
  styleUrl: './profile-edit.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileEdit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);

  readonly user = input.required<IUser | null>();

  readonly isSaving = signal(false);
  readonly isDeleting = signal(false);
  readonly submitted = signal(false);
  readonly apiError = signal<string | null>(null);
  readonly saveState = signal<'idle' | 'saving' | 'success'>('idle');
  readonly selectedFile = signal<File | null>(null);
  readonly previewUrl = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group<ProfileFormModel>(
    {
      firstName:       this.fb.nonNullable.control('', { validators: [Validators.required] }),
      lastName:        this.fb.nonNullable.control('', { validators: [Validators.required] }),
      username:        this.fb.nonNullable.control('', { validators: [Validators.required] }),
      email:           this.fb.nonNullable.control('', { validators: [Validators.required, Validators.email] }),
      dateOfBirth:     this.fb.nonNullable.control(''),   // optional
      password:        this.fb.nonNullable.control(''),   // optional
      confirmPassword: this.fb.nonNullable.control(''),   // optional
      role:            this.fb.nonNullable.control(''),   // optional
    },
    { validators: [passwordMatchValidator] },
  );

  // true when submitted AND the two password values don't match
  readonly passwordMismatch = computed(() =>
    this.submitted() && !!this.form.errors?.['passwordMismatch']
  );

  constructor() {
    effect(() => {
      const u = this.user();
      if (!u) return;
      this.apiError.set(null);
      this.form.patchValue({
        firstName:       u.firstName       ?? '',
        lastName:        u.lastName        ?? '',
        username:        u.username        ?? '',
        email:           u.email           ?? '',
        dateOfBirth:     this.toDateInputValue(u.dateOfBirth),
        password:        '',
        confirmPassword: '',
        role:            u.role            ?? '',
      }, { emitEvent: false });
    });
  }

  onFileSelected(ev: Event): void {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.selectedFile.set(file);
    const old = this.previewUrl();
    if (old) URL.revokeObjectURL(old);
    this.previewUrl.set(file ? URL.createObjectURL(file) : null);
  }

  async update(): Promise<void> {
    this.submitted.set(true);
    this.apiError.set(null);
    this.saveState.set('idle');
    if (this.form.invalid || this.isSaving()) return;
    this.isSaving.set(true);
    this.saveState.set('saving');
    try {
      const v = this.form.getRawValue();
      const pw = v.password.trim();
      await firstValueFrom(
        this.auth.updateUser({
          firstName:   v.firstName.trim(),
          lastName:    v.lastName.trim(),
          username:    v.username.trim(),
          email:       v.email.trim(),
          dateOfBirth: v.dateOfBirth || undefined,
          password:    pw || undefined,
          role:        v.role.trim() || undefined,
          file:        this.selectedFile(),
        }),
      );
      this.form.controls.password.setValue('');
      this.form.controls.confirmPassword.setValue('');
      this.selectedFile.set(null);
      this.previewUrl.set(null);
      this.submitted.set(false);
      this.saveState.set('success');
      setTimeout(() => this.saveState.set('idle'), 1000);
    } catch (e: unknown) {
      const err = e as { error?: { message?: string } };
      this.apiError.set(err?.error?.message ?? 'Update failed. Please try again.');
    } finally {
      this.isSaving.set(false);
    }
  }

  async deleteAccount(): Promise<void> {
    this.apiError.set(null);
    this.isDeleting.set(true);
    try {
      await firstValueFrom(this.auth.deleteAccount());
    } catch (e: unknown) {
      const err = e as { error?: { message?: string } };
      this.apiError.set(err?.error?.message ?? 'Delete failed. Please try again.');
    } finally {
      this.isDeleting.set(false);
    }
  }

  private toDateInputValue(d: unknown): string {
    const date = d instanceof Date ? d : new Date(d as string);
    if (Number.isNaN(date.getTime())) return '';
    const yyyy = String(date.getFullYear());
    const mm   = String(date.getMonth() + 1).padStart(2, '0');
    const dd   = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
}

function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const pw  = group.get('password')?.value as string;
  const cpw = group.get('confirmPassword')?.value as string;
  if (!pw || !cpw) return null;
  return pw === cpw ? null : { passwordMismatch: true };
}

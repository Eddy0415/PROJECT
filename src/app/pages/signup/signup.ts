import { ChangeDetectionStrategy, Component, inject } from '@angular/core'; // standalone + inject()
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms'; // typed reactive forms
import { RouterLink } from '@angular/router'; // navigation link
import { UiModal } from '../../shared/components/ui-modal/ui-modal'; // modal
import { UiInput } from '../../shared/components/ui-input/ui-input'; // shared input
import { UiButton } from '../../shared/components/ui-button/ui-button'; // shared button

type SignupFormModel = {
  fullName: FormControl<string>; // typed value
  username: FormControl<string>; // typed value
  email: FormControl<string>; // typed value
  password: FormControl<string>; // typed value
  confirmPassword: FormControl<string>; // typed value
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
  private readonly fb = inject(FormBuilder); // inject without constructor

  readonly form = this.fb.nonNullable.group<SignupFormModel>({
    fullName: this.fb.nonNullable.control(''), // typed control
    username: this.fb.nonNullable.control(''), // typed control
    email: this.fb.nonNullable.control(''), // typed control
    password: this.fb.nonNullable.control(''), // typed control
    confirmPassword: this.fb.nonNullable.control(''), // typed control
  });
}

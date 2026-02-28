import { ChangeDetectionStrategy, Component, inject } from '@angular/core'; // standalone + inject()
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms'; // typed reactive forms
import { RouterLink } from '@angular/router'; // navigation link
import { UiModal } from '../../shared/components/ui-modal/ui-modal'; // modal shell
import { UiInput } from '../../shared/components/ui-input/ui-input'; // shared input
import { UiButton } from '../../shared/components/ui-button/ui-button'; // shared button

type LoginFormModel = {
  username: FormControl<string>; // typed value
  password: FormControl<string>; // typed value
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
  private readonly fb = inject(FormBuilder); // inject without constructor

  readonly form = this.fb.nonNullable.group<LoginFormModel>({
    username: this.fb.nonNullable.control(''), // typed control
    password: this.fb.nonNullable.control(''), // typed control
  });
}

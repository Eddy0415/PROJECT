import { ChangeDetectionStrategy, Component, inject } from '@angular/core'; // standalone + DI
import { Router, RouterLink } from '@angular/router'; // routing
import { AuthService } from '../../../core/auth/auth-service'; // auth signals
import { UiButton } from '../ui-button/ui-button'; // shared button component

@Component({
  selector: 'ui-navbar',
  standalone: true,
  imports: [RouterLink, UiButton], // import shared button
  templateUrl: './ui-navbar.html',
  styleUrl: './ui-navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiNavbarComponent {
  private readonly router = inject(Router); // router instance
  private readonly auth = inject(AuthService); // auth service

  readonly isAuthenticated = this.auth.isAuthenticated; // computed signal
  readonly currentUser = this.auth.currentUser; // readonly signal

  goProfile(): void {
    this.router.navigate(['/profile']); // navigate to profile
  }
}

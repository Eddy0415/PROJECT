import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../../core/auth/auth-service';
import { UiButton } from '../../../ui-button/ui-button';

@Component({
  selector: 'navbar-pfp',
  standalone: true,
  imports: [RouterLink, UiButton],
  templateUrl: './navbar-pfp.html',
  styleUrl: './navbar-pfp.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarPfp {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  readonly isAuthenticated = this.auth.isAuthenticated;
  readonly currentUser = this.auth.currentUser;

  goProfile(): void {
    this.router.navigate(['/profile']);
  }
}

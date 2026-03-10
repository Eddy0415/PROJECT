import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavService } from '../../services/nav/nav-service';
import { AuthService } from '../../../core/auth/auth-service';
import { Logo } from '../logo/logo';
import { NavbarSearch } from './components/navbar-search/navbar-search';
import { NavbarLink } from './components/navbar-link/navbar-link';
import { NavbarCart } from './components/navbar-cart/navbar-cart';
import { NavbarPfp } from './components/navbar-pfp/navbar-pfp';

@Component({
  selector: 'ui-navbar',
  standalone: true,
  imports: [RouterLink, Logo, NavbarSearch, NavbarLink, NavbarCart, NavbarPfp],
  templateUrl: './ui-navbar.html',
  styleUrl: './ui-navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiNavbarComponent {
  readonly nav = inject(NavService);
  readonly currentUser = inject(AuthService).currentUser;
}

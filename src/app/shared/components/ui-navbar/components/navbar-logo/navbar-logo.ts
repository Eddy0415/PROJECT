import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NavService } from '../../../../services/nav.service';

@Component({
  selector: 'navbar-logo',
  standalone: true,
  templateUrl: './navbar-logo.html',
  styleUrl: './navbar-logo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarLogo {
  readonly nav = inject(NavService);
}

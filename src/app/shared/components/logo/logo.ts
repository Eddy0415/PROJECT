import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NavService } from '../../services/nav/nav-service';

@Component({
  selector: 'navbar-logo',
  standalone: true,
  templateUrl: './logo.html',
  styleUrl: './logo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Logo {
  readonly nav = inject(NavService);
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavService } from '../../services/nav.service';

@Component({
  selector: 'ui-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ui-footer.html',
  styleUrl: './ui-footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiFooter {
  readonly nav = inject(NavService);
}

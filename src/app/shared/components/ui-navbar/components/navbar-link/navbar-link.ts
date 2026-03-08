import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'navbar-link',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar-link.html',
  styleUrl: './navbar-link.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarLink {
  readonly label = input.required<string>();
  readonly link = input<string | null>(null);
  readonly clicked = output<void>();
}

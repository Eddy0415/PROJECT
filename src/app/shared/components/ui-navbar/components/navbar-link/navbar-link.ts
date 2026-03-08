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
  readonly routerLink = input<string | null>(null);  // for router navigation
  readonly href = input<string | null>(null);        // for external or void links
  readonly clicked = output<void>();

  handleClick(): void {
    this.clicked.emit();
  }
}

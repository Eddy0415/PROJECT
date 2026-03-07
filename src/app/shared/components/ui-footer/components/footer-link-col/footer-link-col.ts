import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface FooterLink {
  label: string;
  routerLink?: string;
  action?: () => void;
}

@Component({
  selector: 'footer-link-col',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer-link-col.html',
  styleUrl: './footer-link-col.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterLinkCol {
  readonly title = input.required<string>();
  readonly links = input.required<FooterLink[]>();
}

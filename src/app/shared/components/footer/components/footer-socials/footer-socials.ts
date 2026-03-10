import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'footer-socials',
  standalone: true,
  templateUrl: './footer-socials.html',
  styleUrl: './footer-socials.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterSocials {}

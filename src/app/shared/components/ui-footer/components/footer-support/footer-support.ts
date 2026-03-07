import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'footer-support',
  standalone: true,
  templateUrl: './footer-support.html',
  styleUrl: './footer-support.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterSupport {}

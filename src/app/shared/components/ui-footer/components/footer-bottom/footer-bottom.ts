import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'footer-bottom',
  standalone: true,
  templateUrl: './footer-bottom.html',
  styleUrl: './footer-bottom.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterBottom {}

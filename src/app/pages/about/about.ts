import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './about.scss',
})
export class AboutComponent {}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './about.scss',
})
export class AboutComponent {
  constructor() {
    inject(Title).setTitle('About Us — Item Store');
    inject(Meta).updateTag({ name: 'description', content: 'Learn more about Item Store and our mission.' });
  }
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { HeroCarouselComponent } from './components/hero-carousel/hero-carousel';
import { VisibleProducts } from '../../shared/components/visible-products/visible-products';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroCarouselComponent, VisibleProducts],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  constructor() {
    inject(Title).setTitle('Item Store — Shop the Best Products');
    inject(Meta).updateTag({ name: 'description', content: 'Browse our wide selection of products across all categories.' });
  }
}

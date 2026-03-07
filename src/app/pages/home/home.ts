import { ChangeDetectionStrategy, Component } from '@angular/core';
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
export class HomeComponent {}

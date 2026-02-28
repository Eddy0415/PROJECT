import { Component, inject, signal } from '@angular/core'; // component + DI + signals
import { CommonModule } from '@angular/common'; // ngIf, ngFor, pipes, etc.
import { toSignal } from '@angular/core/rxjs-interop'; // convert Observable → Signal

import { ProductsService } from '../../shared/services/products'; // products API service
import { IProduct } from '../../shared/interfaces/product'; // product interface

import { HeroCarouselComponent } from './components/hero-carousel/hero-carousel'; // hero component
import { ProductCardComponent } from '../../shared/components/product-card/product-card'; // reusable product card

@Component({
  selector: 'app-home', // component selector
  standalone: true, // standalone component (no NgModule)
  imports: [CommonModule, HeroCarouselComponent, ProductCardComponent], // template dependencies
  templateUrl: './home.html', // HTML file
  styleUrl: './home.scss', // SCSS file
})
export class HomeComponent {
  private readonly productsService = inject(ProductsService); // inject service

  readonly loading = signal(true); // loading state
  readonly error = signal<string | null>(null); // error state

  // Convert API Observable directly into a Signal
  readonly products = toSignal(
    this.productsService.getAll(), // call API
    {
      initialValue: [] as IProduct[], // initial empty array
    },
  );

  constructor() {
    // When products signal updates, stop loading
    if (this.products().length >= 0) {
      // if signal has emitted
      this.loading.set(false); // stop loading state
    }
  }
}

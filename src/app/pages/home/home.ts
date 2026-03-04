import { CommonModule } from '@angular/common'; // common directives/pipes                                                // why: template needs it
import { Component, inject, signal } from '@angular/core'; // component + DI + signals                                    // why: rules
import { toSignal } from '@angular/core/rxjs-interop'; // Observable -> Signal                                            // why: convert API stream
import { catchError, of, tap } from 'rxjs'; // rx operators + of()                                                        // why: handle loading/error

import { HeroCarouselComponent } from './components/hero-carousel/hero-carousel'; // hero                                 // why: page section
import { ProductCardComponent } from '../../shared/components/product-card/product-card'; // product card                  // why: shared card
import { IProduct } from '../../shared/interfaces/product'; // type                                                       // why: typing
import { ProductsService } from '../../shared/services/products'; // API service                                          // why: separation of concerns

@Component({
  selector: 'app-home', // selector                                                                                       // why: route renders it
  standalone: true, // standalone                                                                                         // why: rules
  imports: [CommonModule, HeroCarouselComponent, ProductCardComponent], // deps                                            // why: template uses them
  templateUrl: './home.html', // html                                                                                      // why: split
  styleUrl: './home.scss', // scss                                                                                         // why: rules
})
export class HomeComponent {
  private readonly productsService = inject(ProductsService); // DI                                                       // why: rules

  readonly loading = signal(true); // loading state                                                                       // why: UI state
  readonly error = signal<string | null>(null); // error state                                                            // why: UI state

  private readonly products$ = this.productsService.getAll().pipe(
    // source stream                                       // why: keep fetching in service
    tap(() => this.loading.set(false)), // stop loading on success                                                        // why: UX
    catchError(() => {
      // handle errors                                                                                   // why: UX
      this.error.set('Failed to load products'); // set error message                                                     // why: friendly message
      this.loading.set(false); // stop loading                                                                            // why: prevent infinite spinner
      return of([] as IProduct[]); // fallback empty                                                                      // why: render safely
    }),
  );

  readonly products = toSignal(this.products$, { initialValue: [] as IProduct[] }); // signal of products                 // why: template reads signal
}

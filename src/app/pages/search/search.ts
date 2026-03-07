import { CommonModule } from '@angular/common'; // common pipes/directives                                             // why: template
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'; // signals                       // why: rules
import { toSignal } from '@angular/core/rxjs-interop'; // observable -> signal                                         // why: router params
import { ActivatedRoute, RouterLink } from '@angular/router'; // routing                                               // why: query param
import { ProductsCatalogStore } from '../../shared/services/products-store'; // cached products                // why: global search
import { ProductCardComponent } from '../../shared/components/visible-products/components/products-grid/components/product-card/product-card'; // product UI                // why: reuse UI

@Component({
  selector: 'app-search', // page component                                                                           // why: routing
  standalone: true, // no modules                                                                                      // why: rules
  imports: [CommonModule, ProductCardComponent], // template deps                                          // why: render
  templateUrl: './search.html', // html                                                                                // why: separation
  styleUrl: './search.scss', // scss                                                                                   // why: rules
  changeDetection: ChangeDetectionStrategy.OnPush, // optimized                                                        // why: perf
})
export class SearchComponent {
  private readonly route = inject(ActivatedRoute); // DI                                                               // why: rules
  readonly catalog = inject(ProductsCatalogStore); // DI                                                               // why: products cache

  private readonly queryMap = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  }); // signalized params

  readonly q = computed(() => {
    // current query                                                                       // why: filtering
    const raw = this.queryMap().get('q') ?? ''; // read q                                                               // why: URL driven
    return raw.trim(); // normalize                                                                                    // why: consistency
  });

  readonly results = computed(() => {
    // filtered results                                                               // why: show list
    const query = this.q().toLowerCase(); // normalize                                                                  // why: case-insensitive
    const list = this.catalog.products(); // cached products                                                           // why: no refetch
    if (!query) return list; // empty query shows all                                                                  // why: friendly UX
    return list.filter((p) => (p.title ?? '').toLowerCase().includes(query)); // filter by title                      // why: search by name
  });
}

import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core'; // signals + effect              // why: app state
import { firstValueFrom } from 'rxjs'; // promise bridge                                                            // why: no manual subscribe
import { ProductsService } from './products'; // API service                                                         // why: fetch products
import { IProduct } from '../interfaces/product'; // typing                                                          // why: type safety

@Injectable({ providedIn: 'root' }) // singleton store                                                               // why: global reuse
export class ProductsCatalogStore {
  private readonly api = inject(ProductsService); // DI                                                              // why: rules

  private readonly _loaded = signal(false); // internal loaded flag                                                   // why: prevent refetch
  readonly loading = signal(false); // loading state                                                                  // why: UI feedback
  readonly error = signal<string | null>(null); // error state                                                        // why: UI feedback
  readonly products = signal<IProduct[]>([]); // cached products                                                      // why: global search

  readonly categories = computed(() => {
    // derived categories                                                        // why: reuse later
    const list = this.products(); // read products                                                                    // why: computed input
    const set = new Set(list.map((p) => p.category).filter(Boolean)); // unique                                      // why: category list
    return Array.from(set).sort((a, b) => a.localeCompare(b)); // A-Z                                                // why: stable order
  });

  constructor() {
    effect(() => {
      // auto-load once                                                                                  // why: store boot
      if (this._loaded()) return; // already loaded                                                                   // why: guard
      untracked(() => void this.loadAll()); // run without tracking signals                                           // why: avoid loops
    });
  }

  async loadAll(): Promise<void> {
    if (this._loaded()) return; // guard again                                                                        // why: safety
    this.loading.set(true); // start loading                                                                          // why: UI
    this.error.set(null); // reset error                                                                              // why: UI

    try {
      const data = await firstValueFrom(this.api.getAll()); // fetch all                                              // why: API
      this.products.set(data ?? []); // store results                                                                  // why: cache
      this._loaded.set(true); // mark loaded                                                                          // why: prevent refetch
    } catch {
      this.error.set('Failed to load products'); // set message                                                       // why: UI
    } finally {
      this.loading.set(false); // stop loading                                                                        // why: UI
    }
  }
}

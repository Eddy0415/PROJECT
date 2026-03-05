import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core'; // signals + effect              // why: app state
import { firstValueFrom } from 'rxjs'; // promise bridge                                                            // why: no manual subscribe
import { ProductsService } from './products'; // API service                                                         // why: fetch products
import { IProduct } from '../interfaces/product'; // typing                                                          // why: type safety

@Injectable({ providedIn: 'root' }) // singleton store                                                               // why: global reuse
export class ProductsCatalogStore {
  private readonly api = inject(ProductsService); // DI                                                              // why: rules

  private readonly STORAGE_KEY = 'products_cache_v1'; // cache key                                                    // why: persist list
  private readonly _loaded = signal(false); // internal loaded flag                                                   // why: prevent refetch

  readonly loading = signal(false); // loading state                                                                  // why: UI feedback
  readonly error = signal<string | null>(null); // error state                                                        // why: UI feedback
  readonly products = signal<IProduct[]>([]); // cached products                                                      // why: global search

  readonly categories = computed(() => {
    const list = this.products(); // read products                                                                    // why: computed input
    const set = new Set(list.map((p) => p.category).filter(Boolean)); // unique                                      // why: category list
    return Array.from(set).sort((a, b) => a.localeCompare(b)); // A-Z                                                // why: stable order
  });

  constructor() {
    this.hydrateFromStorage(); // attempt cache first                                                                 // why: skip refetch

    effect(() => {
      // persist whenever products changes                                                                             // why: cache updates
      const list = this.products(); // track changes                                                                   // why: effect dependency
      untracked(() => this.persistToStorage(list)); // avoid looping                                                   // why: safe persist
    });

    effect(() => {
      // auto-load once (only if not loaded by cache)                                                                  // why: store boot
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

  updateDescription(id: number, description: string): void {
    this.products.update(
      (list) => list.map((p) => (p.id === id ? { ...p, description } : p)), // immutably update                                 // why: signals best-practice
    );
  }

  removeById(id: number): void {
    this.products.update((list) => list.filter((p) => p.id !== id)); // remove                                        // why: optimistic delete
  }

  async deleteOnServer(id: number): Promise<void> {
    this.error.set(null); // clear                                                                                     // why: UX
    try {
      await firstValueFrom(this.api.deleteById(id)); // call FakeStore DELETE                                          // why: required
      this.removeById(id); // remove locally after OK                                                                  // why: UI reflect
    } catch {
      this.error.set('Failed to delete product'); // message                                                          // why: UX
      throw new Error('delete_failed'); // let UI decide if needed                                                    // why: flow
    }
  }

  private hydrateFromStorage(): void {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY); // read cache                                                // why: persist
      if (!raw) return; // none                                                                                        // why: guard
      const parsed = JSON.parse(raw) as IProduct[]; // parse                                                          // why: restore
      if (!Array.isArray(parsed) || parsed.length === 0) return; // validate                                          // why: safety
      this.products.set(parsed); // apply                                                                             // why: use cached
      this._loaded.set(true); // mark loaded                                                                          // why: skip fetch
    } catch {
      // ignore broken cache                                                                                           // why: resilience
    }
  }

  private persistToStorage(list: IProduct[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list)); // write cache                                     // why: persist updates
    } catch {
      // ignore quota / blocked storage                                                                                // why: resilience
    }
  }
}

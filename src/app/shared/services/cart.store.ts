import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core'; // signals + effect  // why: rules
import { firstValueFrom } from 'rxjs'; // promise bridge                                                                    // why: no manual subscriptions
import { ProductsService } from './products'; // product API                                                                // why: price from API
import { IProduct } from '../interfaces/product'; // typing                                                                 // why: type safety

export type CartEntry = { id: number; qty: number }; // minimal persisted model                                             // why: store only what we need

@Injectable({ providedIn: 'root' }) // singleton store                                                                      // why: shared across app
export class CartStore {
  private readonly productsApi = inject(ProductsService); // DI                                                            // why: rules
  private readonly LS_KEY = 'cart_v1'; // versioned key                                                                     // why: safe migrations later
  private readonly entriesSig = signal<CartEntry[]>(this.readFromStorage()); // cart lines                                // why: persistent cart
  private readonly productsByIdSig = signal<Record<number, IProduct | undefined>>({}); // ✅ key may be missing // id -> product                                // why: fetched details cache
  private readonly inFlightSig = signal<Set<number>>(new Set<number>()); // ids currently loading                          // why: avoid duplicate calls

  readonly entries = this.entriesSig.asReadonly(); // public readonly                                                      // why: encapsulation

  readonly ids = computed(() => this.entriesSig().map((e) => e.id)); // ids list                                            // why: fetch missing
  readonly totalItems = computed(() => this.entriesSig().reduce((sum, e) => sum + e.qty, 0)); // badge                      // why: UI
  readonly subtotal = computed(() => {
    const map = this.productsByIdSig(); // cached products                                                                  // why: compute
    return this.entriesSig().reduce((sum, e) => sum + (map[e.id]?.price ?? 0) * e.qty, 0); // sum price*qty                // why: totals from API
  });

  readonly cartLines = computed(() => {
    const map = this.productsByIdSig(); // cached products                                                                  // why: compute
    return this.entriesSig().map((e) => ({ entry: e, product: map[e.id] ?? null })); // join                               // why: UI view model
  });

  constructor() {
    effect(() => {
      const entries = this.entriesSig(); // react to cart changes                                                          // why: persistence + fetching
      this.writeToStorage(entries); // persist                                                                             // why: keep cart after refresh

      const ids = entries.map((e) => e.id); // current ids                                                                  // why: fetch missing
      untracked(() => void this.loadMissingProducts(ids)); // async side effect                                            // why: keep effect sync
    }); // effect auto-destroys with service                                                                               // why: rules
  }

  add(id: number, qty: number = 1): void {
    if (qty <= 0) return; // guard                                                                                        // why: safety
    this.entriesSig.update((prev) => {
      const idx = prev.findIndex((x) => x.id === id); // locate line                                                      // why: update or insert
      if (idx === -1) return [...prev, { id, qty }]; // new line                                                          // why: append
      const next = [...prev]; // copy                                                                                      // why: immutability
      next[idx] = { id, qty: next[idx].qty + qty }; // increment                                                          // why: add behavior
      return next; // return updated                                                                                       // why: signals
    });
  }

  inc(id: number): void {
    this.entriesSig.update((prev) => prev.map((e) => (e.id === id ? { ...e, qty: e.qty + 1 } : e))); // +1                // why: counter pill
  }

  dec(id: number): void {
    this.entriesSig.update(
      (prev) => prev.map((e) => (e.id === id ? { ...e, qty: Math.max(1, e.qty - 1) } : e)), // -1 min 1                             // why: counter pill
    );
  }

  remove(id: number): void {
    this.entriesSig.update((prev) => prev.filter((e) => e.id !== id)); // drop line                                        // why: bin button
  }

  clear(): void {
    this.entriesSig.set([]); // empty                                                                                      // why: admin/debug
  }

  private readFromStorage(): CartEntry[] {
    try {
      const raw = localStorage.getItem(this.LS_KEY); // read                                                               // why: persistence
      if (!raw) return []; // empty                                                                                        // why: default
      const parsed = JSON.parse(raw) as unknown; // parse                                                                  // why: JSON storage
      if (!Array.isArray(parsed)) return []; // validate                                                                   // why: safety
      return parsed
        .filter((x) => x && typeof x.id === 'number' && typeof x.qty === 'number') // shape check                          // why: safety
        .map((x) => ({ id: x.id, qty: Math.max(1, Math.floor(x.qty)) })); // normalize                                    // why: UX
    } catch {
      return []; // fallback                                                                                                // why: resilience
    }
  }

  private writeToStorage(entries: CartEntry[]): void {
    try {
      localStorage.setItem(this.LS_KEY, JSON.stringify(entries)); // persist                                                // why: refresh-proof
    } catch {
      // ignore storage failures (private mode, quota, etc.)                                                                // why: resilience
    }
  }

  private async loadMissingProducts(ids: number[]): Promise<void> {
    const map = this.productsByIdSig(); // current cache                                                                   // why: check missing
    const inFlight = this.inFlightSig(); // loading set                                                                     // why: dedupe

    const missing = ids.filter((id) => !map[id] && !inFlight.has(id)); // only not loaded                                  // why: avoid spam
    if (missing.length === 0) return; // nothing to do                                                                     // why: efficiency

    // mark as in-flight                                                                                                   // why: dedupe
    this.inFlightSig.update((s) => {
      const next = new Set(s); // copy                                                                                     // why: immutability
      missing.forEach((id) => next.add(id)); // mark                                                                      // why: tracking
      return next; // return                                                                                                // why: signals
    });

    for (const id of missing) {
      try {
        const product = await firstValueFrom(this.productsApi.getById(id)); // fetch one                                   // why: API is price source
        this.productsByIdSig.update((prev) => ({ ...prev, [id]: product })); // cache                                       // why: reuse for totals/UI
      } catch {
        // ignore a single product failure (keep UI stable)                                                                 // why: resilience
      } finally {
        this.inFlightSig.update((s) => {
          const next = new Set(s); // copy                                                                                 // why: immutability
          next.delete(id); // unmark                                                                                        // why: done
          return next; // return                                                                                            // why: signals
        });
      }
    }
  }
}

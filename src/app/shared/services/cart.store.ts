import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { ProductsCatalogStore } from './products-store';

export type CartEntry = { id: number; qty: number };

@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly catalog = inject(ProductsCatalogStore);
  private readonly LS_KEY = 'cart_v1';
  private readonly entriesSig = signal<CartEntry[]>(this.readFromStorage());

  readonly entries = this.entriesSig.asReadonly();

  readonly totalItems = computed(() => this.entriesSig().reduce((sum, e) => sum + e.qty, 0));

  readonly subtotal = computed(() =>
    this.entriesSig().reduce((sum, e) => {
      const product = this.catalog.findById(e.id);
      return sum + (product?.price ?? 0) * e.qty;
    }, 0),
  );

  readonly cartLines = computed(() =>
    this.entriesSig().map((e) => ({
      entry: e,
      product: this.catalog.findById(e.id),
    })),
  );

  constructor() {
    effect(() => {
      this.writeToStorage(this.entriesSig());
    });
  }

  add(id: number, qty: number = 1): void {
    if (qty <= 0) return;
    this.entriesSig.update((prev) => {
      const idx = prev.findIndex((x) => x.id === id);
      if (idx === -1) return [...prev, { id, qty }];
      const next = [...prev];
      next[idx] = { id, qty: next[idx].qty + qty };
      return next;
    });
  }

  inc(id: number): void {
    this.entriesSig.update((prev) => prev.map((e) => (e.id === id ? { ...e, qty: e.qty + 1 } : e)));
  }

  dec(id: number): void {
    this.entriesSig.update((prev) =>
      prev.map((e) => (e.id === id ? { ...e, qty: Math.max(1, e.qty - 1) } : e)),
    );
  }

  remove(id: number): void {
    this.entriesSig.update((prev) => prev.filter((e) => e.id !== id));
  }

  clear(): void {
    this.entriesSig.set([]);
  }

  private readFromStorage(): CartEntry[] {
    try {
      const raw = localStorage.getItem(this.LS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((x) => x && typeof x.id === 'number' && typeof x.qty === 'number')
        .map((x) => ({ id: x.id, qty: Math.max(1, Math.floor(x.qty)) }));
    } catch {
      return [];
    }
  }

  private writeToStorage(entries: CartEntry[]): void {
    try {
      localStorage.setItem(this.LS_KEY, JSON.stringify(entries));
    } catch {}
  }
}

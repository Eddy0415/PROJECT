import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ProductsService } from './products';
import { IProduct } from '../interfaces/product';

@Injectable({ providedIn: 'root' })
export class ProductsCatalogStore {
  private readonly api = inject(ProductsService);

  private readonly STORAGE_KEY = 'products_cache_v1';
  private readonly _loaded = signal(false);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly products = signal<IProduct[]>([]);

  readonly categories = computed(() => {
    const list = this.products();
    const set = new Set(list.map((p) => p.category).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  });

  constructor() {
    this.hydrateFromStorage();
    effect(() => {
      const list = this.products();
      untracked(() => this.persistToStorage(list));
    });
    effect(() => {
      if (this._loaded()) return;
      untracked(() => void this.loadAll());
    });
  }

  findById(id: number): IProduct | null {
    return this.products().find((p) => p.id === id) ?? null;
  }

  async loadAll(): Promise<void> {
    if (this._loaded()) return;
    this.loading.set(true);
    this.error.set(null);
    try {
      const data = await firstValueFrom(this.api.getAll());
      this.products.set(data ?? []);
      this._loaded.set(true);
    } catch {
      this.error.set('Failed to load products');
    } finally {
      this.loading.set(false);
    }
  }

  updateDescription(id: number, description: string): void {
    this.products.update((list) => list.map((p) => (p.id === id ? { ...p, description } : p)));
  }

  removeById(id: number): void {
    this.products.update((list) => list.filter((p) => p.id !== id));
  }

  async createOnServer(payload: Omit<IProduct, 'id' | 'rating'>): Promise<void> {
    this.error.set(null);
    try {
      const created = await firstValueFrom(this.api.create(payload));

      this.products.update((list) => [created, ...list]);
    } catch {
      this.error.set('Failed to create product');
      throw new Error('create_failed');
    }
  }

  async updateOnServer(id: number, payload: Omit<IProduct, 'id' | 'rating'>): Promise<void> {
    this.error.set(null);
    try {
      const updated = await firstValueFrom(this.api.update(id, payload));

      this.products.update((list) => list.map((p) => (p.id === id ? { ...p, ...updated, id } : p)));
    } catch {
      this.error.set('Failed to update product');
      throw new Error('update_failed');
    }
  }

  async deleteOnServer(id: number): Promise<void> {
    this.error.set(null);
    try {
      await firstValueFrom(this.api.deleteById(id));
      this.removeById(id);
    } catch {
      this.error.set('Failed to delete product');
      throw new Error('delete_failed');
    }
  }

  private hydrateFromStorage(): void {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as IProduct[];
      if (!Array.isArray(parsed) || parsed.length === 0) return;
      this.products.set(parsed);
      this._loaded.set(true);
    } catch {
      /* ignore broken cache */
    }
  }

  private persistToStorage(list: IProduct[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
    } catch {
      /* ignore quota */
    }
  }
}

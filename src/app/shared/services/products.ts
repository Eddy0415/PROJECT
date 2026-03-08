import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IProduct } from '../interfaces/product';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly API = 'https://fakestoreapi.com';

  getAll(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${this.API}/products`);
  }

  getById(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.API}/products/${id}`);
  }

  getByCategory(category: string): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${this.API}/products/category/${category}`);
  }

  create(payload: Omit<IProduct, 'id' | 'rating'>): Observable<IProduct> {
    return this.http.post<IProduct>(`${this.API}/products`, payload);
  }

  update(id: number, payload: Omit<IProduct, 'id' | 'rating'>): Observable<IProduct> {
    return this.http.put<IProduct>(`${this.API}/products/${id}`, payload);
  }

  deleteById(id: number): Observable<IProduct> {
    return this.http.delete<IProduct>(`${this.API}/products/${id}`);
  }
}

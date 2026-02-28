import { Injectable, inject } from '@angular/core'; // DI helpers
import { HttpClient } from '@angular/common/http'; // HTTP client
import { Observable } from 'rxjs'; // observable type
import { IProduct } from '../interfaces/product'; // product interface

@Injectable({ providedIn: 'root' }) // singleton service
export class ProductsService {
  private readonly http = inject(HttpClient); // inject HttpClient
  private readonly baseUrl = 'https://fakestoreapi.com/products'; // FakeStore endpoint

  getAll(): Observable<IProduct[]> {
    // fetch all products
    return this.http.get<IProduct[]>(this.baseUrl); // typed GET
  }

  getById(id: number): Observable<IProduct> {
    // fetch one product
    return this.http.get<IProduct>(`${this.baseUrl}/${id}`); // typed GET
  }
}

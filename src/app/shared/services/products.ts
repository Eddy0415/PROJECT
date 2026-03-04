import { HttpClient } from '@angular/common/http'; // http client                                                         // why: API calls
import { Injectable, inject } from '@angular/core'; // DI                                                                 // why: rules
import { Observable } from 'rxjs'; // observable                                                                           // why: HttpClient returns it
import { IProduct } from '../interfaces/product'; // typing                                                                // why: type safety

@Injectable({ providedIn: 'root' }) // singleton service                                                                   // why: shared data access
export class ProductsService {
  private readonly http = inject(HttpClient); // inject http                                                              // why: rules
  private readonly API = 'https://fakestoreapi.com'; // base                                                               // why: fake store

  getAll(): Observable<IProduct[]> {
    // fetch all products                                                                 // why: home + related
    return this.http.get<IProduct[]>(`${this.API}/products`); // GET /products                                            // why: API call
  }

  getById(id: number): Observable<IProduct> {
    // fetch single product                                                      // why: detail page
    return this.http.get<IProduct>(`${this.API}/products/${id}`); // GET /products/:id                                    // why: API call
  }

  getByCategory(category: string): Observable<IProduct[]> {
    // fetch products by category                                  // why: related products
    return this.http.get<IProduct[]>(`${this.API}/products/category/${category}`); // GET /products/category/:cat         // why: API call
  }
}

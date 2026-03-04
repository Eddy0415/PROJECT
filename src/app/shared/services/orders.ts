import { Injectable, inject } from '@angular/core'; // DI
import { HttpClient } from '@angular/common/http'; // http
import { Observable } from 'rxjs'; // return type
import { CartEntry } from './cart.store'; // cart model

export type CreateCartProduct = { productId: number; quantity: number }; // fakestore format
export type CreateCartBody = { userId: number; date: string; products: CreateCartProduct[] }; // fakestore body
export type CreateCartResp = {
  id: number;
  userId: number;
  date: string;
  products: CreateCartProduct[];
}; // response shape

@Injectable({ providedIn: 'root' }) // app singleton
export class OrdersService {
  private readonly http = inject(HttpClient); // DI http
  private readonly API = 'https://fakestoreapi.com'; // base url

  createCartOrder(args: {
    userId: number;
    entries: CartEntry[];
    date?: Date;
  }): Observable<CreateCartResp> {
    const body: CreateCartBody = {
      userId: args.userId, // required by API
      date: (args.date ?? new Date()).toISOString().slice(0, 10), // yyyy-mm-dd
      products: args.entries.map((e) => ({ productId: e.id, quantity: e.qty })), // map to API format
    };

    return this.http.post<CreateCartResp>(`${this.API}/carts`, body); // POST /carts
  }
}

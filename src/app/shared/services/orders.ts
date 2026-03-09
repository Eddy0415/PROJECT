import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartEntry } from './cart.store';

export interface CreateCartProduct {
  productId: number;
  quantity: number;
}
export interface CreateCartBody {
  userId: number;
  date: string;
  products: CreateCartProduct[];
}
export interface CreateCartResp {
  id: number;
  userId: number;
  date: string;
  products: CreateCartProduct[];
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly http = inject(HttpClient);
  private readonly API = 'https://fakestoreapi.com';

  createCartOrder(args: {
    userId: number;
    entries: CartEntry[];
    date?: Date;
  }): Observable<CreateCartResp> {
    const body: CreateCartBody = {
      userId: args.userId,
      date: (args.date ?? new Date()).toISOString().slice(0, 10),
      products: args.entries.map((e) => ({ productId: e.id, quantity: e.qty })),
    };

    return this.http.post<CreateCartResp>(`${this.API}/carts`, body);
  }
}

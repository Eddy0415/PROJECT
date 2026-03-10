import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartEntry } from '../../stores/cart/interfaces/cart-entry';
import { CreateCartResp } from './interfaces/Create-Cart-Resp';
import { CreateCartBodyRequ } from './interfaces/Create-Cart-Body.Requ';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly http = inject(HttpClient);
  private readonly API = 'https://fakestoreapi.com';

  createCartOrder(args: {
    userId: number;
    entries: CartEntry[];
    date?: Date;
  }): Observable<CreateCartResp> {
    const body: CreateCartBodyRequ = {
      userId: args.userId,
      date: (args.date ?? new Date()).toISOString().slice(0, 10),
      products: args.entries.map((e) => ({ productId: e.id, quantity: e.qty })),
    };

    return this.http.post<CreateCartResp>(`${this.API}/carts`, body);
  }
}

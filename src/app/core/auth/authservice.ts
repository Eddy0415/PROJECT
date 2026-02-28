import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { map, Observable, tap } from 'rxjs';
import { Iloginlogoutresp } from './Interfaces/loginlogoutresp';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private router: Router,
    private http: HttpClient,
    private cookieService: CookieService,
  ) {}

  tokenKey = 'eddy';

  public readonly isAuthenticated = signal(!!this.getToken());

  getToken(): string {
    return this.cookieService.get('eddy');
  }

  setToken(token: string): void {
    this.cookieService.set(this.tokenKey, token, { expires: 2, sameSite: 'Strict' });
  }

  authentication(username: string, password: string): Observable<string | undefined> {
    return this.http
      .post<Iloginlogoutresp>('http://192.168.7.156:5005//api/User/Login', {
        username: username,
        password: password,
      })
      .pipe(
        tap((res) => {
          this.setToken(res.Login.AccessToken);
        }),
        map((res) => res.Login.AccessToken),
      );
  }
}

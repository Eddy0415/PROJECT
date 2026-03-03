import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable, tap, map, catchError, throwError } from 'rxjs';
import { IUser } from '../../shared/interfaces/user';
import { ILoginRequ } from './Interfaces/Login';
import { ISignupRequ } from './Interfaces/Signup';
import { IResp } from './Interfaces/Resp';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly cookieService = inject(CookieService);
  private readonly API_BASE = 'https://melaine-palaeobiologic-savourily.ngrok-free.dev/api';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private readonly COOKIE_OPTIONS = { expires: 7, sameSite: 'Strict' as const, secure: true };

  private _token = signal<string | null>(null);
  private _currentUser = signal<IUser | null>(null);
  readonly token = this._token.asReadonly();
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => {
    const token = this._token();
    if (!token) return false;
    return !this.isTokenExpired(token);
  });

  constructor() {
    // Hydrate signals from persisted storage on service instantiation
    const storedToken = this.cookieService.get(this.TOKEN_KEY) || null;
    this._token.set(storedToken);
    this._currentUser.set(this.loadUser());
  }

  register(userData: ISignupRequ): Observable<void> {
    return this.http.post<IResp>(`${this.API_BASE}/auth/register`, userData).pipe(
      tap((res) => this.handleAuthResponse(res)),
      map(() => void 0),
      catchError((err) => throwError(() => err)),
    );
  }

  login(credentials: ILoginRequ): Observable<void> {
    return this.http.post<IResp>(`${this.API_BASE}/auth/login`, credentials).pipe(
      tap((res) => this.handleAuthResponse(res)),
      map(() => void 0),
      catchError((err) => throwError(() => err)),
    );
  }

  private handleAuthResponse(res: IResp): void {
    const token = res?.token;
    if (token) this.persistToken(token);

    if (res?.user) {
      const user: IUser = {
        username: res.user.username,
        email: res.user.email,
        firstName: res.user.firstName,
        lastName: res.user.lastName,
        dateOfBirth: res.user.dateOfBirth,
        imageUrl: res.user.imageUrl,
      };
      this.persistUser(user);
    }
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return this._token();
  }

  private persistToken(token: string): void {
    this.cookieService.set(this.TOKEN_KEY, token, this.COOKIE_OPTIONS);
    this._token.set(token);
  }

  private removeToken(): void {
    this.cookieService.delete(this.TOKEN_KEY);
    this._token.set(null);
  }

  private persistUser(user: IUser): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this._currentUser.set(user);
  }

  private removeUser(): void {
    localStorage.removeItem(this.USER_KEY);
    this._currentUser.set(null);
  }

  private loadUser(): IUser | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as IUser;
    } catch {
      return null;
    }
  }

  private clearSession(): void {
    this.removeToken();
    this.removeUser();
  }

  decodeToken(token: string): Record<string, unknown> | null {
    try {
      return jwtDecode<Record<string, unknown>>(token);
    } catch {
      return null;
    }
  }

  isTokenExpired(token: string = this._token() ?? ''): boolean {
    if (!token) return true;
    const decoded = this.decodeToken(token);
    if (!decoded || typeof decoded['exp'] !== 'number') return true;
    return Date.now() >= decoded['exp'] * 1000;
  }

  getTokenExpiry(): Date | null {
    const token = this._token();
    if (!token) return null;
    const decoded = this.decodeToken(token);
    if (!decoded || typeof decoded['exp'] !== 'number') return null;
    return new Date(decoded['exp'] * 1000);
  }
}

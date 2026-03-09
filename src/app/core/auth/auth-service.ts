import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable, tap, map } from 'rxjs';
import { IUser } from '../../shared/interfaces/user';
import { ILoginRequ } from './Interfaces/Login';
import { ISignupRequ } from './Interfaces/Signup';
import { IResp } from './Interfaces/Resp';
import { IEditResp } from './Interfaces/EditResp';

@Injectable({ providedIn: 'root' })
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
  private _isAuthenticated = signal<boolean>(false);

  readonly token = this._token.asReadonly();
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = this._isAuthenticated.asReadonly();

  constructor() {
    const storedToken = this.cookieService.get(this.TOKEN_KEY) || null;
    this._token.set(storedToken);
    this._currentUser.set(this.loadUser());
    if (storedToken) this._isAuthenticated.set(true);
  }

  register(userData: ISignupRequ): Observable<void> {
    return this.http.post<IResp>(`${this.API_BASE}/auth/register`, userData).pipe(
      tap((res) => this.handleAuthResponse(res)),
      tap(() => this._isAuthenticated.set(true)),
      map(() => void 0),
    );
  }

  login(credentials: ILoginRequ): Observable<void> {
    return this.http.post<IResp>(`${this.API_BASE}/auth/login`, credentials).pipe(
      tap((res) => this.handleAuthResponse(res)),
      tap(() => this._isAuthenticated.set(true)),
      map(() => void 0),
    );
  }

  updateUser(payload: {
    email?: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    dateOfBirth?: string;
    password?: string;
    role?: string;
    file?: File | null;
  }): Observable<void> {
    const fd = new FormData();
    if (payload.email) fd.set('email', payload.email);
    if (payload.firstName) fd.set('firstName', payload.firstName);
    if (payload.lastName) fd.set('lastName', payload.lastName);
    if (payload.username) fd.set('username', payload.username);
    if (payload.dateOfBirth) fd.set('dateOfBirth', payload.dateOfBirth);
    if (payload.password) fd.set('password', payload.password);
    if (payload.file) fd.set('file', payload.file);
    if (payload.role !== undefined) fd.set('role', payload.role);

    return this.http.patch<IEditResp>(`${this.API_BASE}/user`, fd).pipe(
      tap((res) => this.handleEditResponse(res)),
      map(() => void 0),
    );
  }

  deleteAccount(): Observable<void> {
    return this.http.delete<void>(`${this.API_BASE}/user`).pipe(
      tap(() => {
        this.clearSession();
        this._isAuthenticated.set(false);
        this.router.navigate(['/']);
      }),
      map(() => void 0),
    );
  }

  logout(): void {
    this.clearSession();
    this._isAuthenticated.set(false);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return this._token();
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
        role: res.user.role,
        imageUrl: res.user.imageUrl,
      };
      this.persistUser(user);
    }
  }

  private handleEditResponse(res: IEditResp): void {
    const user: IUser = {
      username: res.username,
      email: res.email,
      firstName: res.firstName,
      lastName: res.lastName,
      dateOfBirth: res.dateOfBirth,
      role: res.role,
      imageUrl: res.imageUrl,
    };
    this.persistUser(user);
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
}

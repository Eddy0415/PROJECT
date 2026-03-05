import { inject, Injectable, signal, computed } from '@angular/core'; // signals + DI                                      // why: modern
import { HttpClient } from '@angular/common/http'; // http                                                               // why: api calls
import { Router } from '@angular/router'; // navigation                                                                  // why: redirect
import { CookieService } from 'ngx-cookie-service'; // cookies                                                          // why: token storage
import { Observable, tap, map, catchError, throwError } from 'rxjs'; // rx pipeline                                      // why: keep style
import { IUser } from '../../shared/interfaces/user'; // types                                                           // why: type safety
import { ILoginRequ } from './Interfaces/Login'; // login req                                                           // why: typed
import { ISignupRequ } from './Interfaces/Signup'; // signup req                                                        // why: typed
import { IResp } from './Interfaces/Resp'; // auth response                                                             // why: handleAuthResponse
import { jwtDecode } from 'jwt-decode'; // decode
import { IEditResp } from './Interfaces/EditResp';

@Injectable({ providedIn: 'root' }) // singleton                                                                         // why: global auth
export class AuthService {
  private readonly http = inject(HttpClient); // DI                                                                      // why: rules
  private readonly router = inject(Router); // DI                                                                        // why: redirect
  private readonly cookieService = inject(CookieService); // DI                                                          // why: token persistence
  private readonly API_BASE = 'https://melaine-palaeobiologic-savourily.ngrok-free.dev/api'; // base                      // why: same backend
  private readonly TOKEN_KEY = 'auth_token'; // key                                                                      // why: storage key
  private readonly USER_KEY = 'auth_user'; // key                                                                        // why: storage key
  private readonly COOKIE_OPTIONS = { expires: 7, sameSite: 'Strict' as const, secure: true }; // cookie opts             // why: safer cookie

  private _token = signal<string | null>(null); // internal token                                                        // why: state
  private _currentUser = signal<IUser | null>(null); // internal user                                                    // why: state
  readonly token = this._token.asReadonly(); // readonly                                                                 // why: external read only
  readonly currentUser = this._currentUser.asReadonly(); // readonly                                                     // why: external read only

  readonly isAuthenticated = computed(() => {
    const token = this._token(); // read                                                                                // why: compute
    if (!token) return false; // no token                                                                               // why: safe
    return !this.isTokenExpired(token); // check exp                                                                     // why: valid session
  });

  constructor() {
    const storedToken = this.cookieService.get(this.TOKEN_KEY) || null; // hydrate token                                 // why: restore session
    this._token.set(storedToken); // set                                                                                // why: state
    this._currentUser.set(this.loadUser()); // hydrate user                                                             // why: restore session
  }

  register(userData: ISignupRequ): Observable<void> {
    return this.http.post<IResp>(`${this.API_BASE}/auth/register`, userData).pipe(
      // call                               // why: signup
      tap((res) => this.handleAuthResponse(res)), // persist                                                              // why: reuse logic
      map(() => void 0), // return void                                                                                  // why: caller simplicity
      catchError((err) => throwError(() => err)), // forward                                                             // why: error handling
    );
  }

  login(credentials: ILoginRequ): Observable<void> {
    return this.http.post<IResp>(`${this.API_BASE}/auth/login`, credentials).pipe(
      // call                               // why: login
      tap((res) => this.handleAuthResponse(res)), // persist                                                              // why: reuse logic
      map(() => void 0), // return void                                                                                  // why: caller simplicity
      catchError((err) => throwError(() => err)), // forward                                                             // why: error handling
    );
  }

  updateUser(payload: {
    email?: string; // optional                                                                        // why: patch
    firstName?: string; // optional                                                                    // why: patch
    lastName?: string; // optional                                                                     // why: patch
    username?: string; // optional                                                                     // why: patch
    dateOfBirth?: string; // optional yyyy-mm-dd                                                       // why: api expects string
    password?: string;
    role?: string; // optional new password                                                        // why: api supports it
    file?: File | null; // optional avatar                                                             // why: api supports "file"
  }): Observable<void> {
    const fd = new FormData(); // multipart/form-data                                                  // why: swagger says multipart/form-data
    if (payload.email) fd.set('email', payload.email); // only if provided                              // why: patch minimal
    if (payload.firstName) fd.set('firstName', payload.firstName); // only if provided                  // why: patch minimal
    if (payload.lastName) fd.set('lastName', payload.lastName); // only if provided                     // why: patch minimal
    if (payload.username) fd.set('username', payload.username); // only if provided                     // why: patch minimal
    if (payload.dateOfBirth) fd.set('dateOfBirth', payload.dateOfBirth); // only if provided            // why: patch minimal
    if (payload.password) fd.set('password', payload.password); // only if not empty                    // why: don't send empty password
    if (payload.file) fd.set('file', payload.file); // field name must be "file"
    if (payload.role !== undefined) fd.set('role', payload.role); // why: swagger note

    return this.http.patch<IEditResp>(`${this.API_BASE}/user`, fd).pipe(
      // PATCH /user                 // why: update profile
      tap((res) => this.handleEditResponse(res)), // persist updated user locally                        // why: FIX your UI persistence
      map(() => void 0), // normalize                                                                    // why: cleaner callers
      catchError((err) => throwError(() => err)), // forward error                                       // why: UI handles it
    );
  }

  // NEW: Delete current account
  deleteAccount(): Observable<void> {
    return this.http.delete<void>(`${this.API_BASE}/user`).pipe(
      // DELETE /user                         // why: delete current account
      tap(() => {
        this.clearSession(); // remove token + user                                                      // why: unauthenticated after delete
        this.router.navigate(['/']); // go home                                                          // why: required behavior
      }),
      map(() => void 0), // normalize                                                                    // why: consistent signature
      catchError((err) => throwError(() => err)), // forward                                              // why: UI handles it
    );
  }

  private handleAuthResponse(res: IResp): void {
    const token = res?.token; // token                                                                                   // why: may exist
    if (token) this.persistToken(token); // persist token                                                                 // why: keep session

    if (res?.user) {
      const user: IUser = {
        username: res.user.username, // map                                                                              // why: keep IUser shape
        email: res.user.email, // map                                                                                     // why: keep IUser shape
        firstName: res.user.firstName, // map                                                                             // why: keep IUser shape
        lastName: res.user.lastName, // map                                                                               // why: keep IUser shape
        dateOfBirth: res.user.dateOfBirth,
        role: res.user.role, // map                                                                        // why: keep IUser shape
        imageUrl: res.user.imageUrl, // map                                                                              // why: keep IUser shape
      };
      this.persistUser(user); // save                                                                                    // why: local storage + signal
    }
  }

  private handleEditResponse(res: IEditResp): void {
    // persist updated user locally                  // why: PATCH has no token
    const user: IUser = {
      // map to frontend IUser                                                   // why: shared interface
      username: res.username, // map                                                                  // why: field
      email: res.email, // map                                                                        // why: field
      firstName: res.firstName, // map                                                                // why: field
      lastName: res.lastName, // map                                                                  // why: field
      dateOfBirth: res.dateOfBirth,
      role: res.role, // map (may be string in runtime)                                 // why: keep consistent with existing code
      imageUrl: res.imageUrl, // map                                                                  // why: field
    };

    this.persistUser(user); // writes localStorage + updates signal                                   // why: UI updates instantly
  }

  logout(): void {
    this.clearSession(); // clear                                                                                         // why: end session
    this.router.navigate(['/']); // home                                                                                  // why: flow
  }

  getToken(): string | null {
    return this._token(); // read                                                                                         // why: interceptor needs it
  }

  private persistToken(token: string): void {
    this.cookieService.set(this.TOKEN_KEY, token, this.COOKIE_OPTIONS); // cookie                                         // why: persist
    this._token.set(token); // signal                                                                                    // why: state
  }

  private removeToken(): void {
    this.cookieService.delete(this.TOKEN_KEY); // delete cookie                                                          // why: clear
    this._token.set(null); // reset signal                                                                               // why: state
  }

  private persistUser(user: IUser): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user)); // save                                                    // why: persist
    this._currentUser.set(user); // update signal                                                                        // why: UI reacts
  }

  private removeUser(): void {
    localStorage.removeItem(this.USER_KEY); // remove                                                                     // why: clear
    this._currentUser.set(null); // reset signal                                                                          // why: state
  }

  private loadUser(): IUser | null {
    const raw = localStorage.getItem(this.USER_KEY); // read                                                             // why: hydrate
    if (!raw) return null; // none                                                                                       // why: safe
    try {
      return JSON.parse(raw) as IUser; // parse                                                                           // why: restore
    } catch {
      return null; // fallback                                                                                            // why: safe
    }
  }

  private clearSession(): void {
    this.removeToken(); // remove token                                                                                   // why: logout
    this.removeUser(); // remove user                                                                                     // why: logout
  }

  decodeToken(token: string): Record<string, unknown> | null {
    try {
      return jwtDecode<Record<string, unknown>>(token); // decode                                                        // why: exp
    } catch {
      return null; // invalid                                                                                            // why: safe
    }
  }

  isTokenExpired(token: string = this._token() ?? ''): boolean {
    if (!token) return true; // no token                                                                                  // why: safe
    const decoded = this.decodeToken(token); // decode                                                                    // why: exp
    if (!decoded || typeof decoded['exp'] !== 'number') return true; // no exp                                            // why: treat as expired
    return Date.now() >= decoded['exp'] * 1000; // compare                                                                // why: expiry
  }

  getTokenExpiry(): Date | null {
    const token = this._token(); // read                                                                                // why: compute
    if (!token) return null; // none                                                                                    // why: safe
    const decoded = this.decodeToken(token); // decode                                                                    // why: exp
    if (!decoded || typeof decoded['exp'] !== 'number') return null; // no exp                                            // why: safe
    return new Date(decoded['exp'] * 1000); // date                                                                       // why: UI if needed
  }
}

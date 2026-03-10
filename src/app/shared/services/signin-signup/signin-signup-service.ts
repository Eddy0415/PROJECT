import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SigninSignupService {
  private readonly _pendingError = signal<string | null>(null);

  readonly pendingError = this._pendingError.asReadonly();

  setPendingError(message: string): void {
    this._pendingError.set(message);
  }

  consumeError(): string | null {
    const err = this._pendingError();
    this._pendingError.set(null);
    return err;
  }
}

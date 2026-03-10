import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class NavService {
  private readonly router = inject(Router);

  goHome(): void {
    this.router.navigate(['/']).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  goProducts(): void {
    this.router.navigate(['/']).then(() => {
      setTimeout(() => {
        document.querySelector('.products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    });
  }

  goContact(): void {
    document.querySelector('#footer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

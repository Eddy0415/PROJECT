import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'navbar-search',
  standalone: true,
  templateUrl: './navbar-search.html',
  styleUrl: './navbar-search.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarSearch {
  private readonly router = inject(Router);
  readonly searchText = signal('');

  onInput(value: string): void {
    this.searchText.set(value);
  }

  onSubmit(): void {
    const q = this.searchText().trim();
    this.router.navigate(['/search'], { queryParams: { q } });
  }
}

import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';

interface Crumb {
  label: string;
  path: string;
}

@Component({
  selector: 'ui-breadcrumb',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ui-breadcrumb.html',
  styleUrl: './ui-breadcrumb.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiBreadcrumb {
  private readonly router = inject(Router);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => (e as NavigationEnd).urlAfterRedirects),
      startWith(this.router.url),
    ),
  );

  readonly crumbs = computed<Crumb[]>(() => {
    const url = this.url() ?? '/';
    const segments = url.split('/').filter(Boolean);

    const crumbs: Crumb[] = [{ label: 'Home', path: '/' }];

    let built = '';
    for (const seg of segments) {
      built += `/${seg}`;
      crumbs.push({
        label: seg.charAt(0).toUpperCase() + seg.slice(1),
        path: built,
      });
    }

    return crumbs;
  });
}

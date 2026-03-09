import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { VisibleProducts } from '../../shared/components/visible-products/visible-products';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [VisibleProducts],
  templateUrl: './search.html',
  styleUrl: './search.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  private readonly route = inject(ActivatedRoute);

  private readonly queryMap = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  readonly q = computed(() => (this.queryMap().get('q') ?? '').trim());

  constructor() {
    const title = inject(Title);
    effect(() => {
      const q = this.q();
      title.setTitle(q ? `Search: "${q}" — Item Store` : 'Search — Item Store');
    });
  }
}

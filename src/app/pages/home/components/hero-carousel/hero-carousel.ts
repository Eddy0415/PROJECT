import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiButton } from '../../../../shared/components/ui-button/ui-button';
import { NavService } from '../../../../shared/services/nav.service';

@Component({
  selector: 'app-hero-carousel',
  standalone: true,
  imports: [CommonModule, UiButton],
  templateUrl: './hero-carousel.html',
  styleUrl: './hero-carousel.scss',
})
export class HeroCarouselComponent {
  private readonly destroyRef = inject(DestroyRef);
  readonly nav = inject(NavService);

  slides = signal<string[]>(['/hero/1.jpg', '/hero/2.jpg', '/hero/3.jpg', '/hero/4.jpg']);

  active = signal(0);
  private timerId: number | null = null;

  ngOnInit(): void {
    this.startAutoPlay();
    this.destroyRef.onDestroy(() => this.stopAutoPlay());
  }

  startAutoPlay(): void {
    this.stopAutoPlay();
    const len = this.slides().length;
    if (len <= 1) return;
    this.timerId = window.setInterval(() => {
      this.active.update((i) => (i + 1) % len);
    }, 3500);
  }

  stopAutoPlay(): void {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}

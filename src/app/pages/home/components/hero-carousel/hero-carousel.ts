import { Component, DestroyRef, inject, signal } from '@angular/core'; // signals + destroy hook
import { CommonModule } from '@angular/common'; // common directives

@Component({
  selector: 'app-hero-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-carousel.html',
  styleUrl: './hero-carousel.scss',
})
export class HeroCarouselComponent {
  private readonly destroyRef = inject(DestroyRef); // for cleanup

  slides = signal<string[]>([
    // 4 hero images
    '/hero/1.jpg',
    '/hero/2.jpg',
    '/hero/3.jpg',
    '/hero/4.jpg',
  ]);

  active = signal(0); // current slide index

  private timerId: number | null = null; // autoplay timer id

  ngOnInit(): void {
    // start autoplay
    this.startAutoPlay(); // begin interval
    this.destroyRef.onDestroy(() => this.stopAutoPlay()); // cleanup
  }

  startAutoPlay(): void {
    // start rotating
    this.stopAutoPlay(); // avoid duplicate timers
    const len = this.slides().length; // slide count
    if (len <= 1) return; // nothing to rotate

    this.timerId = window.setInterval(() => {
      // advance every 3.5s
      this.active.update((i) => (i + 1) % len); // next
    }, 3500);
  }

  stopAutoPlay(): void {
    // stop rotation
    if (this.timerId !== null) {
      // if timer exists
      window.clearInterval(this.timerId); // clear it
      this.timerId = null; // reset
    }
  }

  prev(): void {
    // previous slide
    const len = this.slides().length; // slide count
    this.active.update((i) => (i - 1 + len) % len); // wrap-around
  }

  next(): void {
    // next slide
    const len = this.slides().length; // slide count
    this.active.update((i) => (i + 1) % len); // wrap-around
  }

  goTo(i: number): void {
    // jump to slide
    this.active.set(i); // set index
  }
}

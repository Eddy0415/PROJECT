import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ui-modal',
  standalone: true,
  templateUrl: './ui-modal.html',
  styleUrl: './ui-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiModal {
  private readonly router = inject(Router);
  readonly imageUrl = input<string>();

  closeModal(): void {
    this.router.navigate([{ outlets: { modal: null } }]);
  }
}

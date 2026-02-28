import { ChangeDetectionStrategy, Component, input } from '@angular/core'; // standalone + signal inputs

@Component({
  selector: 'ui-modal', // reusable modal
  standalone: true, // no NgModule
  templateUrl: './ui-modal.html', // external template
  styleUrl: './ui-modal.scss', // scss only
  changeDetection: ChangeDetectionStrategy.OnPush, // optimized
})
export class UiModal {
  readonly imageUrl = input<string>(); // right panel image
}

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';
import { IProduct } from '../../../../shared/interfaces/product';
import { UiButton } from '../../../../shared/components/ui-button/ui-button';

interface ActionParams extends ICellRendererParams {
  onDelete?: (id: number) => void;
  onEdit?: (product: IProduct) => void;
}

@Component({
  selector: 'delete-button-renderer',
  standalone: true,
  imports: [UiButton],
  templateUrl: './delete-button-renderer.html',
  styleUrl: './delete-button-renderer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteButtonRenderer implements ICellRendererAngularComp {
  readonly id = signal<number>(0);
  readonly rowData = signal<IProduct | null>(null);
  private onDelete: (id: number) => void = () => {};
  private onEdit: (product: IProduct) => void = () => {};

  agInit(params: ActionParams): void {
    this.id.set(Number(params?.data?.id ?? 0));
    this.rowData.set(params?.data ?? null);
    this.onDelete = params?.onDelete ?? (() => {});
    this.onEdit = params?.onEdit ?? (() => {});
  }

  refresh(params: ActionParams): boolean {
    this.agInit(params);
    return true;
  }

  clickEdit(): void {
    const row = this.rowData();
    if (row) this.onEdit(row);
  }

  clickDelete(): void {
    this.onDelete(this.id());
  }
}

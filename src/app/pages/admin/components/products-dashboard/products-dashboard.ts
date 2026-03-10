import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  Signal,
} from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, GridOptions, NewValueParams, ICellRendererParams } from 'ag-grid-community';
import { ProductsCatalogStore } from '../../../../shared/stores/products/products-store';
import { ProductFormModal, ProductFormValue } from '../product-form-modal/product-form-modal';
import { IProduct } from '../../../../shared/interfaces/product';
import { UiButton } from '../../../../shared/components/button/ui-button';

@Component({
  selector: 'products-dashboard',
  standalone: true,
  imports: [AgGridAngular, ProductFormModal, UiButton],
  templateUrl: './products-dashboard.html',
  styleUrl: './products-dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsDashboard {
  private readonly store: ProductsCatalogStore;

  readonly loading: Signal<boolean>;
  readonly error: Signal<string | null>;
  readonly rowData: Signal<IProduct[]>;

  readonly modalOpen = signal(false);
  readonly editingProduct = signal<IProduct | null>(null);

  readonly gridOptions: GridOptions = {
    pagination: true,
    paginationPageSize: 10,
    paginationPageSizeSelector: [10, 20, 50, 100],
    rowHeight: 48,
    headerHeight: 46,
    defaultColDef: {
      sortable: true,
      filter: true,
      resizable: true,
      floatingFilter: true,
    },
  };

  readonly colDefs: ColDef[] = [
    { field: 'id', headerName: 'ID', width: 80, filter: 'agNumberColumnFilter' },
    { field: 'title', headerName: 'Title', flex: 2, minWidth: 200 },
    { field: 'category', headerName: 'Category', flex: 1, minWidth: 140 },
    {
      field: 'price',
      headerName: 'Price',
      width: 120,
      filter: 'agNumberColumnFilter',
      valueFormatter: (p) => `$${Number(p.value ?? 0).toFixed(2)}`,
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 3,
      minWidth: 280,
      editable: true,
      cellEditor: 'agLargeTextCellEditor',
      cellEditorPopup: true,
      onCellValueChanged: (e: NewValueParams) => this.onDescriptionChanged(e),
    },
    {
      headerName: '',
      width: 160,
      cellRenderer: (params: ICellRendererParams) => {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'display:flex;align-items:center;gap:6px;height:100%';

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'grid-btn grid-btn--edit';
        editBtn.onclick = () => this.openEdit(params.data as IProduct);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'grid-btn grid-btn--delete';
        deleteBtn.onclick = () => void this.deleteRow(Number(params.data?.id ?? 0));

        wrapper.appendChild(editBtn);
        wrapper.appendChild(deleteBtn);
        return wrapper;
      },
      filter: false,
      sortable: false,
      pinned: 'right',
    },
  ];

  constructor() {
    this.store = inject(ProductsCatalogStore);
    this.loading = this.store.loading;
    this.error = this.store.error;
    this.rowData = computed(() => this.store.products());
  }

  openAdd(): void {
    this.editingProduct.set(null);
    this.modalOpen.set(true);
  }

  openEdit(product: IProduct): void {
    this.editingProduct.set(product);
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
    this.editingProduct.set(null);
  }

  async onSaved(value: ProductFormValue): Promise<void> {
    const editing = this.editingProduct();
    if (editing) {
      await this.store.updateOnServer(editing.id, value);
    } else {
      await this.store.createOnServer(value);
    }
    this.closeModal();
  }

  private onDescriptionChanged(e: NewValueParams): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const id = Number((e as any)?.data?.id ?? 0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const desc = String((e as any)?.newValue ?? '');
    if (!id) return;
    this.store.updateDescription(id, desc);
  }

  private async deleteRow(id: number): Promise<void> {
    if (!id) return;
    await this.store.deleteOnServer(id);
  }
}

import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; // ag modules                                     // why: grid features
ModuleRegistry.registerModules([AllCommunityModule]); // register community                                              // why: enable features

import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core'; // signals + DI            // why: rules
import { AgGridAngular } from 'ag-grid-angular'; // grid                                                                  // why: admin table
import type { ColDef, GridOptions, NewValueParams } from 'ag-grid-community'; // ✅ correct typing                        // why: fix error
import { ProductsCatalogStore } from '../../shared/services/products-store'; // store                                     // why: no refetch

import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar'; // sidebar                             // why: admin UI
import { DeleteButtonRendererComponent } from './components/delete-button-renderer/delete-button-renderer'; // delete     // why: action

@Component({
  selector: 'app-admin', // route target                                                                                  // why: existing
  standalone: true, // ✅ no NgModule                                                                                     // why: rules
  imports: [AgGridAngular, AdminSidebarComponent], // imports                                                             // why: standalone
  templateUrl: './admin.html', // template                                                                                // why: clean
  styleUrl: './admin.scss', // ✅ scss                                                                                    // why: rules
  changeDetection: ChangeDetectionStrategy.OnPush, // perf                                                                // why: grid heavy
})
export class Admin {
  private readonly store = inject(ProductsCatalogStore); // DI                                                           // why: rules

  readonly error = this.store.error; // show store errors                                                                 // why: UX
  readonly loading = this.store.loading; // loading state                                                                 // why: UX

  readonly rowData = computed(() => this.store.products()); // grid rows                                                  // why: store driven
  readonly pageSize = signal(10); // local preference                                                                     // why: pagination

  readonly gridOptions: GridOptions = {
    pagination: true, // enable                                                                                           // why: requirement
    paginationPageSize: this.pageSize(), // 10                                                                              // why: requirement
    paginationPageSizeSelector: [10, 20, 50, 100], // ✅ include 10                                                         // why: remove warning
    rowHeight: 44, // nicer                                                                                                // why: UI
    headerHeight: 46, // nicer                                                                                             // why: UI
    defaultColDef: {
      sortable: true, // sorting                                                                                            // why: requirement
      filter: true, // filtering                                                                                            // why: requirement
      resizable: true, // resize                                                                                            // why: UX
      floatingFilter: true, // quick filter row                                                                             // why: UX
    },
    components: {
      deleteButtonRenderer: DeleteButtonRendererComponent, // renderer                                                     // why: delete button
    },
  };

  readonly colDefs: ColDef[] = [
    { field: 'id', headerName: 'ID', width: 90, filter: 'agNumberColumnFilter' }, // id                                  // why: table
    { field: 'title', headerName: 'Title', flex: 2, minWidth: 220 }, // title                                             // why: table
    { field: 'category', headerName: 'Category', flex: 1, minWidth: 160 }, // category                                   // why: table

    {
      field: 'price', // price                                                                                             // why: table
      headerName: 'Price', // label                                                                                        // why: UI
      width: 140, // space                                                                                                 // why: UI
      filter: 'agNumberColumnFilter', // numeric                                                                           // why: UX
      valueFormatter: (p) => `$ ${Number(p.value ?? 0).toFixed(2)}`, // ✅ currency                                        // why: requirement
    },

    {
      field: 'description', // desc                                                                                        // why: table
      headerName: 'Description', // label                                                                                  // why: UI
      flex: 3, // wide                                                                                                     // why: UX
      minWidth: 320, // readable                                                                                            // why: UX
      editable: true, // ✅ edit                                                                                            // why: requirement
      cellEditor: 'agLargeTextCellEditor', // big editor                                                                    // why: description
      cellEditorPopup: true, // popup editor                                                                               // why: UX
      onCellValueChanged: (event: NewValueParams) => this.onDescriptionChanged(event), // ✅ fixed typing                  // why: TS fix
    },

    {
      headerName: '', // actions                                                                                            // why: UI
      width: 130, // button space                                                                                          // why: UI
      cellRenderer: 'deleteButtonRenderer', // ✅ delete button                                                            // why: requirement
      cellRendererParams: {
        onDelete: (id: number) => void this.deleteRow(id), // callback                                                     // why: connect renderer
      },
      filter: false, // no filter                                                                                           // why: UX
      sortable: false, // no sort                                                                                           // why: UX
      pinned: 'right', // keep visible                                                                                      // why: UX
    },
  ];

  private onDescriptionChanged(e: NewValueParams): void {
    const id = Number((e as any)?.data?.id ?? 0); // row id                                                                // why: update needs id
    const desc = String((e as any)?.newValue ?? ''); // new value                                                          // why: update needs value
    if (!id) return; // guard                                                                                              // why: safety
    this.store.updateDescription(id, desc); // update store                                                                // why: requirement
  }

  private async deleteRow(id: number): Promise<void> {
    if (!id) return; // guard                                                                                              // why: safety
    await this.store.deleteOnServer(id); // call API then remove locally                                                   // why: requirement
  }
}

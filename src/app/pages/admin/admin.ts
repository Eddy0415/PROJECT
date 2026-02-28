import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);
import { Component, inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import type { ColDef } from 'ag-grid-community'; // Column Definition Type Interface
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductsService } from '../../shared/services/products';

@Component({
  selector: 'app-admin',
  imports: [AgGridAngular],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  // Row Data: The data to be displayed.
  service = inject(ProductsService);
  rowData = toSignal(this.service.getAll());
  // Column Definitions: Defines the columns to be displayed.
  colDefs: ColDef[] = [
    { field: 'id' },
    { field: 'title' },

    {
      field: 'price',
      cellRenderer: (params: { value: number }): string =>
        params.value > 100 ? 'LARGE VALUE' : 'SMALL VALUE',
    },
    { field: 'description' },
    { field: 'category' },
    { field: 'rating_rate', valueGetter: (p) => p.data.rating.rate },
    { field: 'rating_count', valueGetter: (p) => p.data.rating.count },
  ];
}

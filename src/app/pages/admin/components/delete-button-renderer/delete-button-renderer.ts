import { ChangeDetectionStrategy, Component, signal } from '@angular/core'; // signals                                   // why: rules
import type { ICellRendererAngularComp } from 'ag-grid-angular'; // renderer interface                                   // why: ag grid
import type { ICellRendererParams } from 'ag-grid-community'; // params type                                             // why: typing

type DeleteCb = (id: number) => void; // callback type                                                                    // why: clean typing

@Component({
  selector: 'delete-button-renderer', // renderer                                                                        // why: ag grid
  standalone: true, // no NgModule                                                                                        // why: rules
  templateUrl: './delete-button-renderer.html', // template                                                               // why: clean
  styleUrl: './delete-button-renderer.scss', // scss only                                                                 // why: rules
  changeDetection: ChangeDetectionStrategy.OnPush, // perf                                                                // why: grid perf
})
export class DeleteButtonRendererComponent implements ICellRendererAngularComp {
  readonly id = signal<number>(0); // row id                                                                              // why: callback
  readonly onDelete = signal<DeleteCb>(() => {}); // callback                                                             // why: passed in

  agInit(params: ICellRendererParams & { onDelete?: DeleteCb }): void {
    this.id.set(Number(params?.data?.id ?? 0)); // row id                                                                 // why: delete needs id
    this.onDelete.set(params?.onDelete ?? (() => {})); // callback                                                       // why: wire-up
  }

  refresh(params: ICellRendererParams & { onDelete?: DeleteCb }): boolean {
    this.agInit(params); // update                                                                                       // why: keep simple
    return true; // ok                                                                                                    // why: ag grid
  }

  click(): void {
    this.onDelete()(this.id()); // trigger                                                                               // why: delete action
  }
}

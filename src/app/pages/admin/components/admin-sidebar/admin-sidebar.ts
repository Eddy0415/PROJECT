import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core'; // standalone + signals             // why: rules

@Component({
  selector: 'admin-sidebar', // feature sidebar                                                                         // why: admin UI
  standalone: true, // no NgModule                                                                                      // why: rules
  templateUrl: './admin-sidebar.html', // template                                                                       // why: clean
  styleUrl: './admin-sidebar.scss', // scss only                                                                         // why: rules
  changeDetection: ChangeDetectionStrategy.OnPush, // optimized                                                         // why: perf
})
export class AdminSidebarComponent {
  readonly active = input<'products' | 'users'>('products'); // signal input                                            // why: rules
  readonly isProducts = computed(() => this.active() === 'products'); // derived                                        // why: template
  readonly isUsers = computed(() => this.active() === 'users'); // derived                                              // why: template
}

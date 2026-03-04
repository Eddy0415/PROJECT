import { ChangeDetectionStrategy, Component } from '@angular/core'; // component + perf                                 // why: standalone

@Component({
  selector: 'ui-footer', // shared footer                                                                               // why: global footer
  standalone: true, // no NgModule                                                                                      // why: rules
  templateUrl: './ui-footer.html', // template                                                                           // why: split files
  styleUrl: './ui-footer.scss', // scss                                                                                  // why: rules
  changeDetection: ChangeDetectionStrategy.OnPush, // optimized                                                          // why: perf
})
export class UiFooter {} // presentational                                                                      // why: simple

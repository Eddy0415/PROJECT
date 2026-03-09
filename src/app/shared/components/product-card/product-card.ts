import { Component, input } from '@angular/core'; // component + signal input                                             // why: rules
import { CommonModule, CurrencyPipe } from '@angular/common'; // common + pipe                                            // why: template uses currency
import { RouterLink } from '@angular/router'; // routerLink directive                                                     // why: navigation
import { IProduct } from '../../interfaces/product'; // interface                                                          // why: typing

@Component({
  selector: 'app-product-card', // selector                                                                              // why: shared card
  standalone: true, // standalone                                                                                        // why: rules
  imports: [CommonModule, CurrencyPipe, RouterLink], // add RouterLink                                                   // why: clickable routing
  templateUrl: './product-card.html', // html                                                                            // why: split
  styleUrl: './product-card.scss', // scss                                                                               // why: rules
})
export class ProductCardComponent {
  product = input.required<IProduct>(); // required signal input                                                         // why: rules
}

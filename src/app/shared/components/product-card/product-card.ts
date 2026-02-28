import { Component, input } from '@angular/core'; // ✅ import input()
import { CommonModule, CurrencyPipe } from '@angular/common'; // pipes + common
import { IProduct } from '../../interfaces/product'; // your interface

@Component({
  selector: 'app-product-card', // selector
  standalone: true, // standalone
  imports: [CommonModule, CurrencyPipe], // template deps
  templateUrl: './product-card.html', // html file
  styleUrl: './product-card.scss', // ✅ scss file
})
export class ProductCardComponent {
  product = input.required<IProduct>(); // ✅ required signal input
}

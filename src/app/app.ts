import { Component } from '@angular/core'; // root component
import { RouterOutlet } from '@angular/router'; // routing outlet

@Component({
  selector: 'app-root', // root selector
  standalone: true, // standalone root
  imports: [RouterOutlet], // allow routing
  templateUrl: './app.html', // root template
  styleUrl: './app.css', // root styles
})
export class App {} // keep root clean

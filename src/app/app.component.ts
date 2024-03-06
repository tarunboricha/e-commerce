import { Component } from '@angular/core';
import { ProductSerService } from './services/product-ser.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = '4u-mens-wear';
  constructor (protected product:ProductSerService) {}
  calculateMinHeight() {
    if(this.product.headerComHeight === -1) {
      return `calc(100vh - 120px)`;
    }
    return `calc(100vh - ${this.product.headerComHeight}px)`;
  }
}

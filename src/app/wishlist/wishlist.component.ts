import { Component } from '@angular/core';
import { ProductSerService } from '../services/product-ser.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent {
  constructor(protected productService: ProductSerService) {}

  removeFromWishlist(productId: number) {
    this.productService.removeFromWishlist(productId);
  }
}

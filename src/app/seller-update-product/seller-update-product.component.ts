import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { product } from '../data-type';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-seller-update-product',
  templateUrl: './seller-update-product.component.html',
  styleUrl: './seller-update-product.component.css'
})
export class SellerUpdateProductComponent implements OnInit {

  isLoader: boolean = false;
  productData!: product;

  constructor(private productService: ProductService, private route: ActivatedRoute, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.isLoader = true;
    const productID = this.route.snapshot.paramMap.get('id');
    this.productService.getProductService(parseInt(productID ? productID : '')).subscribe({
      next: (product: product[]) => {
        this.productData = product[0];
        this.isLoader = false;
      },
      error: (error) => {
        this.productService.isServerDown.emit(true);
      }
    });
  }

  updateProduct(product: product) {
    this.productService.updateProductService(product).subscribe({
      next: (result) => {
        this.authService.authSucessMessage.emit("Product is sucessfully updated!!");
        setTimeout(() => {
          this.router.navigate(['seller-dashboard']);
        }, 1500);
      },
      error: (error) => {
        this.productService.isServerDown.emit(true);
      }
    });
  }

  calMinhight() {
    return `calc(100vh - ${this.productService.headerHeight}px - 2rem)`;
  }
}
